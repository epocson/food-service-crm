//connect db
require('sqlagent/mysql').init(CONF.db, CONF.db_log);
//localize
LOCALIZE('/parts/*.html', ['compress']);
LOCALIZE('/forms/*.html', ['compress']);

//setting const
MODULE('Utilit').setConstant();
//setting for company                                                                                                                                                                                                                          
MODULE('Utilit').setCompany();    
MODULE('Utilit').setCDN();