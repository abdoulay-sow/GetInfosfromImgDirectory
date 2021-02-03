$("#files").change(function() {
  filename = this.files[0].name
  console.log(filename);

  if(this.files.length > 0) {
    $('#envoyer').attr('disabled', false)
    if(this.files.length === 1) {
      $('#message').text((this.files.length + 1) +" fichier est ajouté")
    } else {
      $('#message').text((this.files.length + 1) +" fichiers sont ajoutés")
    }    
  }

  
});

$(function() {
  if(!this.files) {
    console.log('WHAR')
    $('#envoyer').attr('disabled', true)
  } else if(this.files.length == 0) {
    console.log('WHAR')
    $('#envoyer').attr('disabled', true)
  }
  else {
    $('#envoyer').attr('disabled', false)
  }
})
