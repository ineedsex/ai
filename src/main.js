
What to do:
1) Finish sample_procedure.
2) Introduce type "function<TYPE>".
3) Re-write sample_procedure and helper functions in the same grammar.
4) Implement a few mutation/cross-over operators.
5) Implement tests.
6) Run it.

function sum(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function natural_log(a) {
  return Math.log(a);
}

function abs(a) {
  return Math.abs(a);
}

function exp(a) {
  return Math.exp(a);
}

function not(a) {
  if (a) {
    return false;
  } else {
    return true;
  }
}

function bernoulli(p) {
  if (p < 0 || p > 1) {
    throw "Invalid p in bernoulli.";
  }
  
  if (Math.random() < p) {
    return true;
  } else {
    return false;
  }
}

function uniformcontinuous01() {
  return Math.random();
}

function uniformdiscrete(min, max) {
  if (min > max) {
    throw "Invalid min-max in uniformdiscrete.";
  }
  
  if (min == max) {
    return min;
  }
  
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function float_to_int(a) {
  return Math.round(a);
}

function int_to_float(a) {
  return a;
}

int_primitive_functions = {
  'sum': {input: ['int', 'int'], implementation: 'sum'},
  'subtract': {input: ['int', 'int'], implementation: 'subtract'},
  'multiply': {input: ['int', 'int'], implementation: 'multiply'},
  'float_to_int': {input: ['float'], implementation: 'float_to_int'},
  'abs': {input: ['int'], implementation: 'abs'},
  'uniformdiscrete': {input: ['int', 'int'], implementation: 'uniformdiscrete'},
};

float_primitive_functions = {
  'sum': {input: ['float', 'float'], implementation: 'sum'},
  'subtract': {input: ['float', 'float'], implementation: 'subtract'},
  'multiply': {input: ['float', 'float'], implementation: 'multiply'},
  'int_to_float': {input: ['int'], implementation: 'int_to_float'},
  'natural_log': {input: ['float'], implementation: 'natural_log'},
  'natural_log': {input: ['positive_float'], implementation: 'natural_log'},
  'abs': {input: ['float'], implementation: 'abs'},
  'exp': {input: ['float'], implementation: 'exp'},
  'uniformcontinuous01': {input: [], implementation: 'uniformcontinuous01'},
};

// Let us show that we can introduce special types
// to decrease the number of program failures.
positive_float_primitive_functions = {
  'exp': {input: ['float'], implementation: 'exp'},
  'exp': {input: ['positive_float'], implementation: 'exp'},
}

bool_primitive_functions = {
  'not': {input: ['bool'], implementation: 'not'},
  'and': {input: ['bool', 'bool'], implementation: 'SPECIAL_AND'},
  'or': {input: ['bool', 'bool'], implementation: 'SPECIAL_OR'},
  'bernoulli': {input: ['float'], implementation: 'bernoulli'},
}

TYPE_primitive_functions = {
  'if': {input: ['bool', '<TYPE>', '<TYPE>'], implementation: 'SPECIAL_IF'},
  'let': {input: ['variable_definition', '<TYPE>'], implementation: ''}, // Should be special.
  'do_2_blocks': {} // Also should be special.
}

/*
variable_definition_primitive_functions {
  'def': ...
}

any_block...
*/

//function_primitive_procedures = {
//  'generate_new': {input: [], implementation: 'generate_new_function' }
//}

primitive_functions = {
  'int': int_primitive_functions,
  'float': float_primitive_functions,
  'positive_float': positive_float_primitive_functions,
  'bool': bool_primitive_functions,
  '<TYPE>': TYPE_primitive_functions,
  // 'function<TYPE>': function_primitive_procedures,
};

function get_random_element(list) {
  return list[uniformdiscrete(0, list.length - 1)];
}

random_constant_generators = {
  'int': function() { return uniformdiscrete(-10, 10); },
  'float': uniformcontinuous01,
  'bool': function() { return bernoulli(0.5); },
  'positive_float': function() { return Math.exp(uniformcontinuous01()); },
}

function sample_procedure_helper(env, output_type, output_type_pattern) {
  var operator_name = get_random_element(Object.keys(primitive_functions[output_type_pattern]));
  var returning_procedure = [operator_name];
  var operator_data = primitive_functions[output_type_pattern][operator_name];
  var operands = operator_data['input'];
  for (operand_index in operands) {
    operand = operands[operand_index];
    if (operand == "<TYPE>") {
      operand = output_type;
    }
    returning_procedure.push(sample_procedure(env, operand));
  }
  return returning_procedure;
}

function sample_categorical(values, probs) {
  var p = Math.random();
  var probs_sum = probs.reduce(sum);
  probs = probs.map( function(v) { return v / probs_sum; } );
  
  var accum = 0;
  for (index = 0; index < probs.length; index++) {
    accum += probs[index];
    if (p < accum || index + 1 == probs.length) {
      return values[index];
    }
  }
}

function sample_procedure(env, output_type) {
  expr_type = sample_categorical(
    ['primitive_operator', 'if', 'let', 'variable_mutation', 'loop'],
    [5, 1, 1, 1]);
  
  if (expr_type == 'primitive_operator') {
    return sample_procedure_helper(env, output_type, output_type);
  }
  
  return null;
}

function wr(text) {
  document.getElementById('mydiv').innerHTML += JSON.stringify(text);
  document.getElementById('mydiv').innerHTML += '<hr>';
}

for (index = 0; index < 10; index++) {
  //wr(sample_procedure('int'));
}

wr(sample_categorical([1, 2, 3], [1, 2, 3]));























