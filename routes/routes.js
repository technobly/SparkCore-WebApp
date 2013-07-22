// handler for homepage
exports.home = function(req, res) {
    // if user is not logged in, ask them to login
    if (typeof req.session.username === 'undefined') {
        //var msg = upTime();
        //response.send(msg);
        res.render('home', { title: 'Spark Core - Web App © BDub Technologies '+ new Date().getFullYear()});
    }
    // if user is logged in already, take them straight to the web app
    else res.redirect('/');
};

// handler for form submitted from homepage
exports.home_post_handler = function(req, res) {
    // if the username is not submitted, give it a default of "Anonymous"
    var username = req.body.username || 'Anonymous';
    // store the username as a session variable
    req.session.username = username;
    // redirect the user to homepage
    res.redirect('/');
};

// handler for showing simple pages
exports.page = function(req, res) {
    var name = req.query.name;
    var contents = {
        who: '<div align=\'center\'>Dedicated to providing the coolest must-have tech in the world!</div>',
        what: '<div align=\'center\'>Spark Core Web App - An amazing web based interface for your Spark Core.<br><br>It uses the power of Node.js, Express, Jade, Stylus for the backend, jQuery and AngularJS for the frontend, and the Spark API to let you remote control your own Spark Core.<br><br>Simply log into your device, and take control... from anywhere in the world! Fork us on Github.com and make your own!</div>',
        where: '<div align=\'center\'>You can contact us at:</div><br><div align=\'center\'><address><strong>BDub Technologies</strong><br>bdubtechnologies@gmail.com</address></div>',
        chat: '<div align=\'center\'>Sorry digsby widgets are borked... new version coming soon!<br><br><embed src="http://w.digsby.com/dw.swf?c=6a4gb98qiaoannda" type="application/x-shockwave-flash" wmode="transparent" width="250" height="300"></embed></div>'
    };
    res.render('page', { title: 'Spark Core - Web App © BDub Technologies '+ new Date().getFullYear()+' - ' + name, username: req.session.username, content:contents[name] });
};