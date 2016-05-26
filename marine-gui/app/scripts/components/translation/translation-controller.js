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
    'optionsSlider':'Options',
    'periodSlider':'Last update: ',
    'dailySlider':'Daily',
    'tenDaysSlider':'10 Days',
    'monthSlider':'Monthly',
    'month90Slider':'Monthly 90° percentile',
    'dailyItemUpdate':'Last daily update: ',
    'tenItemUpdate':'Last decadic update: ',
    'monthlyItemUpdate':'Last monthly update: ',
    'monthly90ItemUpdate':'Last monthly percentile update: ',
    'FOO': 'This is a paragraph'
  });

  $translateProvider.translations('gr', {
      'language':'Γλώσσα',
      'titleToolbar': 'Marine',
      'welcomeLogin':'Καλώς ορίσατε',
      'userLogin':' Χρήστης',
      'passwordLogin':'Κωδικός',
      'buttonOnLogin':'Eίσοδος',
      'buttonOffLogin':'¨Εξοδος',
      'errorLogin':'Δεν έχετε την απαραίτητη εξουσιοδότηση!!!',
      'statusLogin':'Είσαι συνδεδεμένος ως:',
      'accountToolbar':'Λογαριασμός',
      'geocoderToolbar':'Αναζήτηση',
      'geocoderPlaceholder':'Αναζήτηση...',
      'myAreasToolbar':'περιοχές μου',
      'filtersToolbar': 'Φίλτρα',
      'titleFilters': 'Σύνθετα Φίλτρα Θαλάσσιου Χάρτη',
      'helpFilters': 'Παρακαλώ επιλέξτε το επιθυμητό εύρος',
      'dataProvidersFilters': 'Πάροχοι Δεδομένων',
      'settingsToolbar': 'Ρυθμίσεις',
      'basemapSettings': 'Βασικός χάρτης',
      'categoriesTitleSettings': 'Κατηγορίες ποιότητας υδάτων',
      'loadingResult':'Φόρτωση αποτελέσματος...',
      'noResult':'Δεν βρέθηκαν αποτελέσματα...',
      "openSettings":"Επιλογές",
      "trasparence":"Διαφάνεια",
      "chl":"Χλωροφύλλη",
      "sst":"Θερμοκρασία Θαλάσσιας Επιφάνειας",
      "wt":"Διαύγεια Υδάτων",
      'currentTime':'Τρέχουσα  ημερομηνία: ',
      'CatalogSettings':'Κατάλογος',
      'catalogHelpSettings':'Mεταβείτε στον κατάλογο αναζήτησης',
      'helpSettings':'Βοήθεια',
      'descriptionHelpSettings':'Mεταβείτε στην βοήθεια',
      'optionsSlider':'επιλογές',
      'periodSlider':'Τελευταία ανανέωση: ',
      'dailySlider':'Ημερήσια',
      'tenDaysSlider':'10 Ημέρες',
      'monthSlider':'Μηνιαία',
      'month90Slider':'Μηνιαία στην 90 εκατοστιαία θέση',
      'dailyItemUpdate':'Τελευταία ημερήσια ενημέρωση: ',
      'tenItemUpdate':'Τελευταία δεκαήμερη ενημέρωση: ',
      'monthlyItemUpdate':'Τελευταία μηνιαία ενημέρωση: ',
      'monthly90ItemUpdate':'Τελευταία ανανέωση μηνιαίας εκατοστιαίας θέσης: ',
      'FOO': 'Αυτή είναι μια παράγραφος'
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
    'optionsSlider':'Opzioni',
    'periodSlider':'Ultimo aggiornamento: ',
    'dailySlider':'Giornaliero',
    'tenDaysSlider':'10 giorni',
    'monthSlider':'Mensile',
    'month90Slider':'Mensile 90° percentile',
    'dailyItemUpdate':'Ultimo aggiornamento giornaliero: ',
    'tenItemUpdate':'Ultimo aggiornamento della decade: ',
    'monthlyItemUpdate':'Ultimo aggiornamento mensile: ',
    'monthly90ItemUpdate':'Ultimo aggiornamento mensile 90°percentile: ',
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
