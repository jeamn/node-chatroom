const logout = function(req, res) {
  try {
    delete req.session.admin;
  } catch (err) {
    console.log(err);
  }
  res.json({ status: 200 });
};

module.exports = logout;
