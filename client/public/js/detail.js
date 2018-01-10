window.onload = function() {
  const id = window.location.href.split('?')[1].split('=')[1];
  // console.log(id);
  axios.get(`http://localhost:3000/movies/${id}`).then((res) => {
    document.getElementById('detail').innerHTML = res.data[0].movieName;
  }).catch(function(err) {
    console.log(err);
  });
};
