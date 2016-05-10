  'use strict';
  var app = angular.module('rheticus');

  app.config(['$translateProvider',function ($translateProvider) {
  $translateProvider.translations('en', {
    'language':'Language',
    'titleToolbar': 'Marine',
    'welcomeLogin':'Welcome',
    'userLogin':'User',
    'passwordLogin':'Password',
    'buttonOnLogin':'Login',
    'buttonOffLogin':'Logout',
    'errorLogin':'Not authorized !!!',
    'statusLogin':'You are logged as:',
    'accountToolbar':'Account',
    'geocoderToolbar':'Search',
    'geocoderPlaceholder':'Search ...',
    'myAreasToolbar':'My areas',
    'filtersToolbar': 'Filters',
    'titleFilters': 'Marine Map Advanced Filters',
    'helpFilters': 'Please select the desired range',
    'dataProvidersFilters': 'Data Providers',
    'settingsToolbar': 'Settings',
    'basemapSettings': 'Basemap',
    'categoriesTitleSettings': 'Water quality categories',
    'loadingResult':'Loading result...',
    'noResult':'No result found...',
    "openSettings":"Options",
    "trasparence":"Trasparence",
    "chl":"Chlorophyll",
    "sst":"Sea Surface Temperature",
    "wt":"Water Trasparency",
    'currentTime':'Current date: ',
    'CatalogSettings':'Catalog',
    'catalogHelpSettings':'Go to search catalog',
    'helpSettings':'Help',
    'descriptionHelpSettings':'Go to help',
    'FOO': 'This is a paragraph'
  });

  $translateProvider.translations('gr', {
    'language':'Γλώσσα',
    'titleToolbar': 'Marine',
    'welcomeLogin':'Καλωσόρισμα',
    'userLogin':'Μεταχειριζόμενος',
    'passwordLogin':'Σύνθημα',
    'buttonOnLogin':'Σύνδεση',
    'buttonOffLogin':'Αποσυνδέομαι',
    'errorLogin':'δεν επιτρέπεται !!!',
    'statusLogin':'Έχετε συνδεθεί ως: ',
    'accountToolbar':'Λογαριασμός',
    'geocoderToolbar':'Έρευνα',
    'geocoderPlaceholder':'Έρευνα ...',
    'myAreasToolbar':'περιοχές μου',
    'filtersToolbar': 'φίλτρα',
    'titleFilters': 'Marine Map Advanced Filters',
    'helpFilters': 'Please select the desired range',
    'dataProvidersFilters': 'Οι πάροχοι δεδομένων',
    'settingsToolbar': 'Ρυθμίσεις',
    'basemapSettings': 'Basemap',
    'categoriesTitleSettings': 'κατηγορίες ποιότητας του νερού',
    'loadingResult':'αποτέλεσμα φόρτωσης...',
    'noResult':'Δεν βρέθηκε αποτέλεσμα...',
    "openSettings":"επιλογές",
    "trasparence":"διαφάνεια",
    "chl":"Χλωροφύλλη",
    "sst":"Επιφανειακή θερμοκρασία θάλασσας",
    "wt":"νερό διαφάνεια",
    'currentTime':'Σημερινή ημερομηνία: ',
    'CatalogSettings':'Κατάλογος',
    'catalogHelpSettings':'Πηγαίνετε να ψάξετε Κατάλογος',
    'helpSettings':'Βοήθεια',
    'descriptionHelpSettings':'Πηγαίνετε να βοηθήσει',
    'FOO': 'This is a paragraph'
  });

  $translateProvider.translations('it', {
    'language':'Lingua',
    'titleToolbar': 'Marine',
    'welcomeLogin':'Benvenuto',
    'userLogin':'Utente',
    'passwordLogin':'Password',
    'buttonOnLogin':'Accedi',
    'buttonOffLogin':'Esci',
    'errorLogin':'Credenziali errate !',
    'statusLogin':'Sei registrato come:',
    'geocoderToolbar':'Cerca',
    'geocoderPlaceholder':'Cerca ...',
    'accountToolbar':'Account',
    'myAreasToolbar':'Le mie aree',
    'filtersToolbar': 'Filtri',
    'titleFilters': 'Filtri avanzati ',
    'helpFilters': "Seleziona l'intervallo desiderato",
    'dataProvidersFilters': 'Fornitori di dati',
    'settingsToolbar': 'Impostazioni',
    'basemapSettings': 'Mappa di sfondo',
    'categoriesTitleSettings': "Categorie di qualità dell'acqua",
    'loadingResult':'Caricamento ...',
    'noResult':'Nessun risultato trovato...',
    "openSettings":"Opzioni",
    "trasparence":"Trasparenza",
    "chl":"Clorofilla",
    "sst":"Temperatura superficiale del mare",
    "wt":"Trasparenza dell'acqua",
    'currentTime':'Data corrente: ',
    'CatalogSettings':'Catalogo',
    'catalogHelpSettings':'Vai al catalogo di ricerca',
    'helpSettings':'Aiuto',
    'descriptionHelpSettings':'Visualizza aiuto',
    'FOO': 'This is a paragraph'
  });

  var determineCurrentLanguage= function () {

   var userLang = navigator.language || navigator.browserLanguage;
   if (userLang.indexOf("it")>-1){
     userLang="it";
   }else if (userLang.indexOf("gr")>-1){
     userLang="gr";
   }else{
     userLang="en";
   }
   return userLang;
 };


  $translateProvider.useSanitizeValueStrategy(null);
  $translateProvider.preferredLanguage(determineCurrentLanguage());







  }]);
