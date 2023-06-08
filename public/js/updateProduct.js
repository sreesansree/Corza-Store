const input = document.querySelectorAll('.hidden-input');
const imgs = document.querySelectorAll('.imgurl')
const productid=document.getElementById('productid')
const indexes=document.querySelectorAll('.form-check-input')

const images=[]


document.querySelectorAll('.imgurl').forEach((img, index) => {
  img.addEventListener('click', () => {
  
    input[index].click();

    
  });
});
const formData = new FormData();
formData.append('id', productid.value);
input.forEach((fileInput, index) => {
  console.log(fileInput.files.length,'lweeeeennnnnnn');
  if (fileInput.files.length >= 0) {
    formData.append(`file_${index}`, fileInput.files[0]);
    formData.append(`index_${index}`, index);
    console.log(formData,'foooooooorrrrrrrrrrmmmmmmmm');
  }
});

input.forEach((item, index) => {
  item.addEventListener('change', () => {
    const files = item.files; // or const files = file
    indexes[index].checked=true
   const imgindex=indexes[index].value
    console.log(indexes[index].value);
    for (let i = 0; i < files.length; i++) {
       
      const reader = new FileReader();
      reader.onload = (event) => {
        const contents = event.target.result;
        imgs[index].src = contents; 
      };
      console.log(images);
      reader.readAsDataURL(files[i]);
    }
  });
});


// Append the selected files and corresponding indexes to the FormData object

const response=fetch('/upadateproduct',{
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        id: productid,
        formdata:formData
    })
})
const data=response.json()
