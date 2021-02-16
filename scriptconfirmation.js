//// Compléter 2 élements avec infos de commande au préalablement stockées dans session storage :
console.log(sessionStorage);

let numeroCommande = document.getElementById("numerocommande");
let totalCommande = document.getElementById("prixpaye");

numeroCommande.innerHTML = '<span>Commande numéro : '+sessionStorage.getItem('Numéro de commande :') +'</span>';
totalCommande.innerHTML = '<span >Total : '+ sessionStorage.getItem('Prix payé') +' €</span>';

let boutonFinDeCommande = document.getElementById("findecommande");
boutonFinDeCommande.addEventListener('click', function(){ //écoute du click pour vider la session Storage (avec numéro de commande et total)
    sessionStorage.clear();
})