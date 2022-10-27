 exports.install = function() {
    ROUTE('+GET /*'                     );
    ROUTE('GET /login',       view_login);   
    ROUTE('GET  /logout',         logout);       
}

function view_login() {                      
    self.view('page/login'); 
}
function logout() {
    var self = this;        
    MAIN.session.remove(self.sessionid);    
    self.cookie(CONF.cookie, '', '-1 day');                
    self.redirect('/');	
}
