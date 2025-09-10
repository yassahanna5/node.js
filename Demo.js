//Task 1

function add(n1, n2) {
  return n1 + n2;
}

function mul(n1, n2) {
  return n1 * n2;
}

function sub(n1, n2) {
  return n1 - n2;
}

function div(n1, n2) {
  if (n2 != 0) {
    return n1 / n2;
  } else return "error";
}

module.exports = {
  add,
  mul,
  sub,
  div,
};
