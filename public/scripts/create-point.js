

function populateUFs() {
    const ufSelect = document.querySelector("select[name=uf]")

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then( res => res.json()) /*funcao anonima retornando uma valor*/
    .then( states => {

        for (const state of states) {
            ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
            
        }
    })
}

populateUFs()

function getCities(event) {
    const citySelect = document.querySelector("select[name=city]")
    const stateInput = document.querySelector("input[name=state]")

    const ufValue = event.target.value

    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text



    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

    citySelect.innerHTML = "<option value>Selecione a cidade</option>"
    citySelect.disabled = true

    fetch(url)
    .then( res => res.json()) /*funcao anonima retornando uma valor*/
    .then( cities => {



        for (const city of cities) {
            citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
            
        }

        citySelect.disabled = false
    })
    
}



document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)


//itens de coleta
//pegar todos os li´s
const itemsToCollect = document.querySelectorAll(".items-grid li")

for (const item of itemsToCollect) {
    item.addEventListener("click", handleSelectedItem)
}

const colectedItems = document.querySelector("input[name=items]")

let selectedItems = []

function handleSelectedItem(event) {
    const itemLi = event.target
    //add or remove a class on js
    
    itemLi.classList.toggle("selected") //adiciona ou remove uma classe
    
    const itemId = itemLi.dataset.id  //salva o id da li
    //console.log(itemLi.dataset.id)
    
    //verificar se existem items selecionados, se sim
    //pegar os items selecionados.
    const areadySelected = selectedItems.findIndex( item =>{
        const itemFound = item == itemId
        return itemFound
    })
    //se ja estiver seecionado, retirar a seleção
    if( areadySelected >= 0) {
        //tirar da seleção
        const filteredItems = selectedItems.filter( item => {
            const itemIsDifferent = item != itemId
            return itemIsDifferent
        })

        selectedItems = filteredItems
    }else {
        //se não estiver selecionado, selecionar
        //adiciona a seleção
        selectedItems.push(itemId)
    }
    
    colectedItems.value = selectedItems
    //atualizar o campo escondido com os dados selecionados
    
    

}