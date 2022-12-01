var Pr = MODULE('Promise');   

NEWSCHEMA('User', function(schema) {
	schema.define('id'        , 'Number'     	  	           );
	schema.define('status', 'Number', 'c');  
	schema.define('first_name', 'string(100)', true, 'cu');	
	schema.define('last_name', 'string(100)', true, 'cu');
    schema.define('Login', 'string(50)', 'c');
	schema.define('Password', 'string(50)', 'c');
	schema.define('telegram_uid', 'string(100)', 'cu');
	schema.define('Email', 'string(50)', 'cu');
	schema.define('Phone', 'string(20)', 'cu');
	schema.define('Created_at', 'Date', 'c');
	schema.define('Updated_at', 'Date', 'u');
	schema.define('Role', 'Number', 'c');

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
            if (!resp) $.success(false);
           		 return $.success(true, resp);  
            	 return $.callback(resp||null);
		}, 'user')	
	});


	schema.setGet(function ($) {
		var o = Object.assign({}, U.isEmpty($.query) ? $.options : $.query);									
		var sql = DB(); 
		sql.debug = true;         
		sql.select('user', 'user').make(function(builder) {      
			builder.fields('id', 
						   'login', 
						   'first_name', 
						   'last_name', 
						   'role', 
						   'phone', 
						   'email', 
						   'status', 
						   'telegram_uid', 
						   'created_at', 
						   'updated_at');
			if (o.id) builder.in('id', o.id);   
			if (o.email) builder.where('email', o.email);
			if (o.login) builder.where('!lower(login)', o.login);  
			if (o.role) builder.in('role', o.role);	    	
			if (o.pass) builder.where('pass', o.pass.md5());	    				
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

	schema.setSave(function ($) {	
		var model = schema.clean($.model); 
		var isINSERT = (model.id ==0) ? true : false;  
		var act = isINSERT ? 'c' : 'u';		
       	var sql = DB();           
	   	sql.debug = true;		   		
	   	sql.save('user', 'user', isINSERT, function(builder, isINSERT) {
	   		builder.set(schema.filter('*'+act, model));
	      	if (model.password) builder.set('password', model.password.md5());    
	      	if (!isINSERT) {
	        	builder.where('id', model.id);        
	      	}            	      	
	    })

	    sql.exec(function(err, user) {	
			if (err) {
				LOGGER('error', 'User/save', err);          	        	
	        	return $.success(false);	
	      	} 
	      	if (isINSERT) model.id = user.identity;                                  
	      	return $.success(true, model);               
  		}, 'user')			
	});

	schema.setRemove(function ($) {		
		var o = Object.assign({}, U.isEmpty($.params) ? $.options : $.params);											
		var sql = DB(); 		
		sql.debug = true;

		if (!o.id) return $.success(false);

		sql.update('user', 'user').make(function (builder) {			
			builder.set('status', -1);	//change status		
			builder.where('id', o.id);			
		})	

		sql.exec(function(err, resp) {                      
			if (err) {
				LOGGER('error', 'User/remove', err);
				return $.success(false);
			}						
			if (!resp) $.success(false, 'User not found');
			return $.success(true);
		}, 'user')	
	});

	schema.addWorkflow('grid', function($) {
		var o = $.query||{};
		o.page = o.page||1;
        o.limit = o.limit||30;

		var sql = DB(); 
		sql.debug = true;         
		sql.listing('user', 'user').make(function(builder) {                        
            if (o.sort) builder.sort(o.sort, (o.order=='asc') ? false : true);
                else builder.sort('created_at', true);
            if (o.search) {
                builder.scope(function() {                  
                    builder.like('login', o.search, '*');         
                    builder.or();
                    builder.like('email', o.search, '*');                                 
                });                 
            };            
            if (isNum(o.status)) {
            	builder.where('status', o.status);                         
            } else builder.where('status', '>', -1);                         
            builder.page(o.page, o.limit);
        }); 

        sql.exec(function(err, resp) {
			if (err) {
				LOGGER('error', 'User/grid', err);
				$.callback([]);
			}
			$.callback({'total': resp.count, 'rows': resp.items});
		}, 'user');	
    });

NEWSCHEMA('user/login', function(schema) {
    schema.define('Login', 'string(50)', true);
	schema.define('Password', 'string(50)',true); 
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
