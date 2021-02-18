class Despesa {
	constructor(ano, mes, dia, tipo, descricao, valor) {
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
	}

	validarDados() {
		for (let i in this) {
			if (this[i] == undefined || this[i] == '' || this[i] == null) {
				return false
			}
		}
		return true
	}
}

class Bd {

	constructor() {
		let id = localStorage.getItem('id')

		if (id === null) {
			localStorage.setItem('id', 0)
		}
	}

	getProximoId() {
		let proximoId = localStorage.getItem('id')
		return parseInt(proximoId) + 1
	}

	gravar(d) {
		let id = this.getProximoId()

		localStorage.setItem(id, JSON.stringify(d))

		localStorage.setItem('id', id)
	}

	recuperarTodosRegistros() {
		// array despesas
		let despesas = Array();

		let id = localStorage.getItem('id');
		for (let index = 1; index <= id; index++) {
			let despesa = JSON.parse(localStorage.getItem(index));

			if (despesa === null) {
				continue;
			}
			despesa.id = index;
			despesas.push(despesa);
		}

		return despesas;
	}

	pesquisar(despesa) {
		let despesasFiltatradas = this.recuperarTodosRegistros();
		// ano
		if (despesa.ano != '') {
			despesasFiltatradas = despesasFiltatradas.filter(d => d.ano == despesa.ano);
		}
		// mes 
		if (despesa.mes != '') {
			despesasFiltatradas = despesasFiltatradas.filter(d => d.mes == despesa.mes);
		}
		// dia
		if (despesa.dia != '') {
			despesasFiltatradas = despesasFiltatradas.filter(d => d.dia == despesa.dia);
		}

		// tipo
		if (despesa.tipo != '') {
			despesasFiltatradas = despesasFiltatradas.filter(d => d.tipo == despesa.tipo);
		}

		// descrição
		if (despesa.descricao != '') {
			despesasFiltatradas = despesasFiltatradas.filter(d => d.descricao == despesa.descricao);
		}

		// valor 
		if (despesa.valor != '') {
			despesasFiltatradas = despesasFiltatradas.filter(d => d.valor == despesa.valor);
		}

		return despesasFiltatradas;
	}

	remover(id) {
		localStorage.removeItem(id);
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

	let despesa = new Despesa(
		ano.value,
		mes.value,
		dia.value,
		tipo.value,
		descricao.value.trim(),
		valor.value
	)


	if (despesa.validarDados()) {
		bd.gravar(despesa)

		document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso';
		document.getElementById('modal_titulo_div').className = 'modal-header text-success';
		document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso!';
		document.getElementById('modal_btn').innerHTML = 'Voltar';
		document.getElementById('modal_btn').className = 'btn btn-success';

		// limpando a tela
		dia.value = "";
		descricao.value = "";
		valor.value = "";
		mes.value = "";
		ano.value = "";
		tipo.value = "";

		//dialog de sucesso
		$('#modalRegistraDespesa').modal('show')
	} else {

		document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro';
		document.getElementById('modal_titulo_div').className = 'modal-header text-danger';
		document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos corretamente!';
		document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir';
		document.getElementById('modal_btn').className = 'btn btn-danger';

		//dialog de erro
		$('#modalRegistraDespesa').modal('show')
	}


}

function carregaListaDespesas(despesas = Array(), filtro = false) {
	if (despesas.length == 0 && filtro == false) {
		despesas = bd.recuperarTodosRegistros();
	}

	// selecionando tbody da tabela
	let listaDespesas = document.getElementById('listaDespesas');
	listaDespesas.innerHTML = '';

	// listando o array de forma dinâmica
	despesas.forEach(function (d) {
		// criando tr
		let linha = listaDespesas.insertRow();

		// criando td
		linha.insertCell(0).innerHTML = `${d.dia} / ${d.mes} / ${d.ano}`;

		switch (d.tipo) {
			case '1': d.tipo = 'Alimentação'; break;
			case '2': d.tipo = 'Educação'; break;
			case '3': d.tipo = 'Lazer'; break;
			case '4': d.tipo = 'Saúde'; break;
			case '5': d.tipo = 'Transporte'; break;
		}

		linha.insertCell(1).innerHTML = d.tipo;
		linha.insertCell(2).innerHTML = d.descricao;
		linha.insertCell(3).innerHTML = d.valor;

		let btn = document.createElement('button');
		btn.className = 'btn btn-danger';
		btn.innerHTML = '<i class="fas fa-times"></i>';
		btn.id = `id_despesa_${d.id}`;

		btn.onclick = function () {
			let id = this.id.replace('id_despesa_', '');
			bd.remover(id);
			window.location.reload();
		}

		linha.insertCell(4).append(btn);
	})
}

function pesquisarDespesa() {
	let ano = document.getElementById('ano').value;
	let mes = document.getElementById('mes').value;
	let dia = document.getElementById('dia').value;
	let tipo = document.getElementById('tipo').value;
	let descricao = document.getElementById('descricao').value;
	let valor = document.getElementById('valor').value;

	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);
	let despesas = bd.pesquisar(despesa);
	carregaListaDespesas(despesas, true);
}
