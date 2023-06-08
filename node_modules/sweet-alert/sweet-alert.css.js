module.exports = `
*, 
*::before, 
*::after {
  box-sizing: border-box;  }

:host {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  animation: sweet-alert-filter-in 400ms;
  animation-fill-mode: forwards;
  display: none;
  font-family: inherit; }

:host(.exiting) {
  animation: sweet-alert-filter-out 400ms; }
:host(.visible) {
  display: flex }

.overlay {
  display: block; 
  opacity: 0.5;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: black;
  z-index: 1000; }

.modal {
  margin: auto;  
  display: block;
  width: 500px;
  min-height: 313px;
  background: white;
  padding: 20px;
  text-align: center;
  border-radius: 5px;
  border: 1px solid rgba(0,0,0,0.25);
  box-shadow: 0 0 18px rgba(0,0,0,0.4);
  z-index: 2000; }

  .icon {
    width: 80px;
    height: 80px;
    border: 4px solid grey;
    border-radius: 50%;
    margin: 20px auto;
    box-sizing: content-box;
    cursor: default;
    position: relative;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none; }

    .icon::before,
    .icon::after {
      opacity: 1;
      content: ''; 
      display: block;
      position: absolute; 
      transition: 200ms all;
      border-radius: 10px; }

  .icon.warning {
    border-color: #f8bb86; }

    .icon.warning::before {
      width: 5px;
      height: 45px;
      background: #f8bb86;
      top: 10px;
      left: 38px;}

    .icon.warning::after {
      width: 7px;
      height: 7px;
      background: #f8bb86;
      top: 60px;
      left: 37px; }

  .icon.error {
    border-color: #f27474; }

    .icon.error::before {
      width: 5px;
      height: 50px;
      background: #f27474;
      top: 17px;
      left: 38px;
      transform: rotate(-45deg); }

    .icon.error::after {
      width: 5px;
      height: 50px;
      background: #f27474;
      top: 17px;
      left: 38px; 
      transform: rotate(45deg); }

  .icon.success {
    border-color: #a5dc86; }

    .icon.success::before {
      width: 5px;
      height: 45px;
      background: #a5dc86;
      top: 18px;
      left: 46px;
      transform: rotate(45deg); }

    .icon.success::after {
      width: 25px;
      height: 5px;
      background: #a5dc86;
      top: 46px;
      left: 14px;
      transform: rotate(45deg); }

  .icon.working {
    animation: sweet-alert-spin 1000ms linear infinite;
    border-color: transparent;
    border-top-color: #f8bb86; }

  .title {
    line-height: 50px;
    font-family: inherit;
    font-size: 20px;
    font-weight: bold; }

  .content {
    line-height: 30px;
    font-size: 16px; }

  button {
    border-radius: 3px;
    background: #298eea;
    cursor: pointer;
    color: white;
    padding: 10px;
    font-family: inherit;
    font-size: 14px;
    margin: 20px 7px 0px;
    line-height: 1em;
    display: inline-block;
    border: none; }

  button:hover {
    background: #2180d7; }

  button.primary {
    background: #15CD72; }

  button.primary:hover {
    background: #0CB863; }

@keyframes sweet-alert-filter-in {
  0% { 
    opacity: 0; 
    filter: blur(60px); 
    transform: scale(2); 
    -webkit-filter: blur(60px);
  }
  100% { 
    opacity: 1; 
    filter: blur(0px);
    transform: scale(1); 
    -webkit-filter: blur(0px); 
  }
}

@keyframes sweet-alert-filter-out {
  0% { 
    opacity: 1; 
    filter: blur(0px);
    transform: scale(1); 
    -webkit-filter: blur(0px); 
  }
  100% { 
    opacity: 0; 
    filter: blur(60px);
    transform: scale(2); 
    -webkit-filter: blur(60px);  
  }
}

@keyframes sweet-alert-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`