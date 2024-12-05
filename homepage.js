document.getElementById('edit-profile').addEventListener('click', () => {
   window.location.href = '/gotoeditprofile';
  });
  
  document.getElementById('browse-fields').addEventListener('click', () => {
    console.log('Browse Fields button clicked');
  });
  
  document.getElementById('add-favorite').addEventListener('click', () => {
    window.location.href = '/gotofavourite';
  });
  
  document.getElementById('provide-feedback').addEventListener('click', () => {
  window.location.href = '/gotofeedback';
  });
  
  document.getElementById('send-inquiry').addEventListener('click', () => {
    window.location.href = '/gotoinquiry';
  });
  
  document.getElementById('logout').addEventListener('click', () => {
    console.log('Log Out button clicked');
  });
  
