
// var split_RE = /\$\w*{[^}]*}|{\/}|{:}|{else}/,
//     match_RE = /\$(\w*){([^}]*)}|{(\/|:|else)}/g;

var EXPRESSION = /^\$(\w*){([^}]*)}$/,
    ELSE = /^{:}|{else}$/,
    CLOSE = /^{\/}$/;

// console.log('EXPRESSION', EXPRESSION.source);
// console.log('ELSE', ELSE.source);
// console.log('CLOSE', CLOSE.source);

var split_RE = new RegExp(
  EXPRESSION.source.substr(1).replace(/\$$|\(|\)/g, '') + '|' +
  ELSE.source.substr(1).replace(/\$$/, '') + '|' +
  CLOSE.source.substr(1).replace(/\$$/, '')
);
var match_RE = new RegExp(split_RE.source, 'g'),
    empty_raised = { chunks: [] };

var self_closed_expressions = {
  '': true,
};

// console.log('split_RE', split_RE.source);

function _raiseContent (last_expression, key, next_raised) {
  if( next_raised.chunks.length === 1 && typeof next_raised.chunks[0] === 'string' ) {
    last_expression[key] = next_raised.chunks[0];

  } else if( next_raised.chunks.length > 0 ) {
    last_expression[key] = next_raised.chunks;
  }

  return next_raised;
}

function _raiseParts (texts, expressions, _i) {
  // console.log('_raiseParts', texts, expressions, _i);
  var chunks = [], current_expression, matched_expression, next_raised,
      raised = { chunks: chunks },
      last_expression = null;

  for( var i = _i || 0, n = texts.length - 1 ; i <= n ; i++ ) {
    current_expression = expressions[i];

    // console.log('text', texts[i]);
    // console.log('current_expression', current_expression, i === n );
    // console.log('i n', i, n);

    if( texts[i] ) chunks.push(texts[i]);

    if( i === n ) {
      if( current_expression ) throw new Error('expressions length mismatch');
      break;
    }

    if( EXPRESSION.test(current_expression) ) {
      matched_expression = current_expression.match(EXPRESSION);

      if( !matched_expression )
        throw new Error(current_expression + ' is not a valid expression');

      // if( last_expression && last_expression.waiting_close )
      //   throw new Error('unclosed last expression ' + JSON.stringify(last_expression) );

      if( self_closed_expressions[matched_expression[1]] ) {
        // console.log('self_closed_expression', current_expression);
        chunks.push({ $$: matched_expression[2] });
      } else {
        last_expression = { $: matched_expression[1], $$: matched_expression[2] };

        // console.log('next_raised', next_raised);

        next_raised = _raiseContent(last_expression, '_', i <= n && _raiseParts(texts, expressions, i + 1) || empty_raised );

        if( 'index' in next_raised ) i = next_raised.index;

        if( next_raised.otherwise ) {
          next_raised = _raiseContent(last_expression, '__', i <= n && _raiseParts(texts, expressions, i + 1) || empty_raised );

          if( 'index' in next_raised ) i = next_raised.index;
        }

        if( next_raised.closed ) {
          chunks.push(last_expression);
          last_expression = null;
        }
      }

    } else if( ELSE.test(current_expression) ) {

      if( last_expression ) chunks.push(last_expression);

      raised.otherwise = true;
      raised.index = i;
      return raised;

    } else if( CLOSE.test(current_expression) ) {

      if( !_i ) throw new Error('Unexpected close token');

      if( last_expression ) chunks.push(last_expression);

      raised.closed = true;

      raised.index = i;
      return raised;

    } else throw new Error('Unknow expression type: ' + current_expression );
  }

  return raised;
}

module.exports = function (template_str) {

  // console.log('template_str', template_str);

  var raised = _raiseParts( template_str.split(split_RE), template_str.match(match_RE) );

  // if( raised.index >= 0 ) throw new Error('...');

  return raised.chunks;

};
