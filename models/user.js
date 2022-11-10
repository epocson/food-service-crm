var Pr = MODULE('Promise');   

NEWSCHEMA('User', function(schema) {
	schema.define('id'        , 'Number'     	  	            );  
	schema.define('first_name', 'string(100)', true);	
	schema.define('last_name', 'string(100)', true);
    schema.define('Login', 'string(50)')
	schema.define('Password', 'string(50)');
	schema.define('telegram_uid', 'string(100)');
	schema.define('Email', 'string(50)');
	schema.define('Phone', 'string(20)');
	schema.define('Created_at', 'Date');
	schema.define('Updated_at', 'Date');
    schema.define('age', Number >= 18, true);
	schema.define('Role', 'Number');
	schema.setResource('default');      

	schema.setDefault(function(property) {    
		if (property === 'status')      	   return 1;   	
		if (property === 'created_at')         return new Date();   	
		if (property === 'updated_at')         return new Date();   	
  	}); 
	  var o = Object.assign({}, U.isEmpty($.query) ? $.options : $.query);									
	  var sql = DB(); 
	  sql.debug = true;         
	  sql.select('user', 'user').make(function(builder) {      
		  builder.fields('id', 
		  'first_name',
		  'last_name',
		  'login',
		  'password',
		  'telegram_uid',
		  'email',
		  'phone',
		  'created_at',
		  'updated_at',
		  'age',
		  'role');

		  	if (o.id) builder.in('id', o.id);   
		  	if (o.email) builder.where('email', o.email);
		 	if (o.login) builder.where('!lower(login)', o.login);  
		 	if (o.role) builder.in('role', o.role);	    
			if (o.password) builder.where('password', o.password.md5());	    				
			if (U.isArray(o.status)) builder.in('status', o.status);      		                  		
	       		else if (typeof o.status == 'string') builder.in('status', (o.status == 'active') ? [1] : (o.status == 'all') ? [0,1] : [0]);                             	
	        	else if (isNum(o.status)) builder.where('status', o.status);                               
	        	else builder.where('status', 1); 
	       	builder.first();		
		})	

		sql.exec(function(err, resp) {                      
			if (err) {        
                LOGGER('error', 'User/get', err);          
                return $.success(false);	        
            }    
            //if (!resp) $.success(false);
            //return $.success(true, resp);
            return $.callback(resp||null);
		}, 'user')	
	});


	schema.setGet(function ($) {

	});

	schema.setSave(function ($) {		
	});

	schema.setRemove(function ($) {		
	});

	schema.addWorkflow('grid', function($) {
    });
});

NEWSCHEMA('user/login', function(schema) {
    schema.define('Login', 'string(50)');
	schema.define('Password', 'string(50)'); 
	schema.define('autologin', 'boolean', false)

	schema.addWorkflow('exec', async function($) {
	    	try {
				var model = schema.clean($.model);
            var user = await Pr.get('User', model);	

            if (!user) {            	
                $.success(false, RESOURCE('!user_pass'));                
                return; 
            }		

            var opt = {};
            opt.name = CONF.cookie;
            opt.key = CONF.cookie_secret;
            opt.id = user.id;
            opt.expire = (model.autologin) ? '20 days' : '1 day';    
            opt.data = user;  
            MAIN.session.setcookie($, opt, $.done());            
            AUDIT('users', $, 'login', user.id + ': ' + user.login);      

                } catch (err) {
		    LOGGER('error', 'Login', err);                 
	            $.invalid('!auth');                    
        	    return;
				
 		} 
        })
})
