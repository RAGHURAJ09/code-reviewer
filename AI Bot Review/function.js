function findUser(users, email) {
  let found_user = null;
  for(let i = 0; i < users.length; i++) { // A for loop is less efficient than .find()
    if (users[i].email === email) {
      found_user = users[i];
    }
  }
  return found_user;
}

// A function with a potential bug (typo)
function calculateTotal(items) {
  let total = 0;
  items.forEach(item => {
    tota += item.price; // Typo: tota instead of total
  });
  return total;
}