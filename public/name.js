var name = $('#name');
console.log(name);
$('html').keydown(function (e) {
    if (e.which == 13 && name.val().length !== 0) {
     sessionStorage.setItem(JSON.stringify(name.val()))
      name.val('')
    }
  });