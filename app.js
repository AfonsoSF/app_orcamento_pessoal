class Despesa{
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    //Fazendo o método validar dados, para validar se todos os dados foram preenchidos
    validarDados(){
        //utilizando o for in para percorrer todos os dados do objeto
        for(let i in this){//O i percorre todos os atributos
            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            }
        }
        return true
    }
}
//guardar a despesa no localStorage
class Bd{
    constructor(){
        let id = localStorage.getItem('id')
        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }
    //verificando se o índice ID já é existente
    getProximoId(){
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId)+1
    }

    gravar(d) {
        let id = this.getProximoId()
        //json.stringfy transforma os parâmentros de despesa em um arquivo json
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)
    }

    recuperarTodosResgistros(){
        let despesas = Array()

		let id = localStorage.getItem('id')

        //recuperando as despesas cadastradas
        for (let i = 1; i <= id; i++) {
            let despesa = JSON.parse(localStorage.getItem(i))
            //passando o valor para o array despesas
            if (despesa === null) {
                continue
            }
            despesa.id = i
            despesas.push(despesa)
        }

        return despesas
    }

    //pesquisar os dados
    pesquisar(despesa){
        let despesasFiltradas = Array()
        //utilizando o método abaixo para não precisar reescrever o código de pegar os dados
        despesasFiltradas = this.recuperarTodosResgistros()

        //ano
        //d é a variavel que recebe o valor do registro no banco
        if (despesa.ano != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        
        //mes
        if (despesa.mes != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }
        //dia
        if (despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }
        //tipo
        if (despesa.tipo != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }
        //descricao
        if (despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }
        //valor
        if (despesa.valor != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }
        return despesasFiltradas
    }

    remover(id){
        localStorage.removeItem(id)
    }
}
let bd = new Bd()

function cadastrarDespesa() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    //Objeto despesa
    let despesa = new Despesa(
        ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value
    )

    if(despesa.validarDados()) {
		bd.gravar(despesa)

		document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
		document.getElementById('modal_titulo_div').className = 'modal-header text-success'
		document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso!'
		document.getElementById('modal_btn').innerHTML = 'Voltar'
		document.getElementById('modal_btn').className = 'btn btn-success'

		//dialog de sucesso
		$('#modalRegistraDespesa').modal('show')

        //limpando os campos
        ano.value=''
        mes.value=''
        dia.value=''
        tipo.value=''
        descricao.value=''
        valor.value=''
	} else {
		
		document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro'
		document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
		document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos corretamente!'
		document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
		document.getElementById('modal_btn').className = 'btn btn-danger'

		//dialog de erro
		$('#modalRegistraDespesa').modal('show') 
	}
}

//Carregar lista de despesas
function carregaListaDespesa(despesas= Array(), filtro = false) {
    //let despesas = Array()
    if (despesas.length == 0 && filtro == false) {
        //colocando despesas como sendo um array então ao ser chamado no body, o valor passado vai ser 0, mostrando todos os resultados, mas se não for 0, então é pq foi chamado pela pesquisa passando parâmentros
        despesas = bd.recuperarTodosResgistros()
    }
    

    //Selecionando o elemento da tabela
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    despesas.forEach(function(d) {
        let linha = listaDespesas.insertRow()//Cria linhas(<tr>) no elemento selecionado
        //precisa criar a let linha para que seja possível atuar em cada linha individualmente.
        //criando colunas
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
        
        switch (d.tipo) {
            case '1': d.tipo = 'alimentação'
                break;
            case '2': d.tipo = 'educação'
                break;
            case '3': d.tipo = 'lazer'
                break;
            case '4': d.tipo = 'saúde'
                break;
            case '5': d.tipo = 'transporte'
                break;
        }
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor
        //criando o botao exclusão
        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = 'id_despesa_' + d.id
        btn.onclick = function () {
            //remove despesa
            let id = this.id.replace('id_despesa_', '')
            
            bd.remover(id)

            window.location.reload()
        }
        linha.insertCell(4).append(btn)
    })
}

function pesquisarDespesa() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)
    let despesas = bd.pesquisar(despesa);

    this.carregaListaDespesa(despesas, true)
}
