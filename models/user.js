var Pr = MODULE('Promise');   

NEWSCHEMA('User', function(schema) {
	schema.define('id'        , 'Number'     	  	            );  
	schema.define('first_name', 'string(100)');	
	schema.define('last_name', 'string(100)');
    schema.define('Login', 'string(50)')
	schema.define('Password', 'string(50)');
	schema.define('telegram_uid', 'string(100)');
	schema.define('Email', 'string(50)');
	schema.define('Phone', 'string(20)');
	schema.define('Created_at', 'Date');
	schema.define('Uploaded_at', 'Date');
    schema.define('age', Number, (value, model) => age > 18);
	schema.setResource('default');      

	schema.setDefault(function(property) {    
		if (property === 'dt')         return new Date();   	
  	}); 

	schema.setGet(function ($) {

	});

	schema.setSave(function ($) {		
	});

	schema.setRemove(function ($) {		
	});

	schema.addWorkflow('grid', function($) {
    });
})

    

	schema.addWorkflow('exec', async function($) {
	    	try {
		   //
                } catch (err) {
		    LOGGER('error', 'Login', err);                 
	            $.invalid('!auth');                    
        	    return;
 		} 
        })
