//// Compléter 2 élements avec infos de commande au préalablement stockées dans session storage :

let numeroCommande = document.getElementById("numerocommande");
let totalCommande = document.getElementById("prixpaye");

numeroCommande.innerHTML = '<span>Commande numéro : '+sessionStorage.getItem('Numéro de commande :') +'</span>';
totalCommande.innerHTML = '<span >Total : '+ sessionStorage.getItem('Prix payé') +' €</span>';