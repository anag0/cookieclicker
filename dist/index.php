<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI plays Cookie Clicker</title>
</head>
<body>
    <h2>
        Copy this to your console or Tempermonkey window
    </h2>
    <p>
        <textarea id="console">
window.assetPath = '<?php echo $_SERVER['PHP_SELF'] ?>'';
var s = document.createElement('script');
s.setAttribute('src', assetPath + 'cookiebrain.js');
document.body.appendChild(s);
s = document.createElement('style');
s.setAttribute('href', assetPath + 'cookiebrain.css');
document.head.appendChild(s);
        </textarea>
    </p>
    <h2>
        You can also use this bookmarklet
    </h2>
    <p>
        <textarea id="bookmarklet">
javascript:(function(s){
    window.assetPath = '<?php echo $_SERVER['PHP_SELF'] ?>'';
    var s = document.createElement('script');
    s.setAttribute('src', assetPath + 'cookiebrain.js');
    document.body.appendChild(s);
    s = document.createElement('style');
    s.setAttribute('href', assetPath + 'cookiebrain.css');
    document.head.appendChild(s);
})();
        </textarea>
    </p>
</body>
</html>