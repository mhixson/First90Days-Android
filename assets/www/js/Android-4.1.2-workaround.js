/*
  This file exists because Android 4.1.2 is crashing when an event goes to any <div>
  that does not have an 'onclick' event handler.  If you find another <div> that crashes, 
  just add it to this list. 
*/
$('top-nav-container').setAttribute('onclick', 'function() { }');
$('content-container').setAttribute('onclick', 'function() { }');
$('setup-container').setAttribute('onclick', 'function() { }');
$('page-head').setAttribute('onclick', 'function() { }');