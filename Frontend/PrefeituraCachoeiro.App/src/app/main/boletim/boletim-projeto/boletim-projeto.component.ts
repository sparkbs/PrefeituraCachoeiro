import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder,  FormGroup, Validators } from '@angular/forms';
import { jsPDF } from 'jspdf';
import { ToastService } from 'src/app/services/toast.service';
import { BoletimMedicoesResponse, MedicoesResponse } from 'src/app/response/medicoesResponse/medicoesResponse';
import { MedicoesService } from 'src/app/services/medicoes.service';
import { MedicoesRequest } from 'src/app/request/MedicoesRequest/medicoesRequest';
import { BoletimService } from 'src/app/services/boletim.service';
import { BoletimMedicaoDetalhadoResponse, BoletimProjetoCabecalho, SubBoletim } from 'src/app/response/BoletimResponse/boletimResponse';
import { PrefeituraService } from 'src/app/services/prefeitura.service';
import { ActivatedRoute } from '@angular/router';
import { ContratosResponse } from 'src/app/response/contratosResponse/todosContratosResponse';
import { PrefeituraFilter, PrefeituraResponse } from 'src/app/response/prefeituraResponse/prefeituraResponse';
import { ContratosService } from 'src/app/services/contratos.service';
import { AuthService } from 'src/app/services/auth.service';
import { AESEncryptDecriptService } from 'src/app/shared/aesEncryptDecript.service';
import { BuscarContratosRequest } from 'src/app/request/ContratoRequest/buscarContratosRequest';
import { BuscarBoletimDetalhadoRequest } from 'src/app/request/BoletimRequest/boletimDetalhadoRequest';
import { ProjetoRequest } from 'src/app/request/ProjetoRequest/projetoRequest';
import { ProjetoService } from 'src/app/services/projeto.service';
import { ProjetoResponse } from 'src/app/response/projetoResponse/projetoResponse';


@Component({
  selector: 'app-boletim-projeto',
  templateUrl: './boletim-projeto.component.html',
  styleUrls: ['./boletim-projeto.component.scss']
})
export class BoletimProjetoComponent implements OnInit {

  @ViewChild('content', { static: false }) element!: ElementRef;
 
   dataSource: SubBoletim[] = [];
   boletimCabecalho: BoletimProjetoCabecalho;
   valorTotalMedicao: number = 0;
   nomeUnidade!: string | undefined;
   logoTipoImgUrl: string = '';
   listaContratos: ContratosResponse[] = [];
   listaMedicoes: MedicoesResponse[] = [];
   form: FormGroup;
   contratoSelecionado: ContratosResponse;
   contratoSelecionadoId: number;
   boletim: BoletimMedicaoDetalhadoResponse;
   contratoId = '0';
   medicaoId = '0';
   clienteId = '0';
   projetoId = '0';
   medicaoSelecionado: number;
   listaPrefeitura: PrefeituraResponse[] = [];
   prefeituraSelecionadoId: number;
   listaMedicoesAgrupados: BoletimMedicoesResponse[] =[];
   dadosSeparadosProjeto: SubBoletim[] =[];
   listaMedicoesSelecionadasAgrupados: BoletimMedicoesResponse;
   nomePrefeitura: string = ''; // URL tratada da imagem do logotipo
   isEnabledInputs: boolean = false;
   enableMedicao: boolean = false;
   enableContrato: boolean = false;
   enableProjeto: boolean = false;
   listaProjetos: ProjetoResponse[] = [];
   projetoSelecionadoId: number;
   projetoSelecionado: ProjetoResponse;
   projetosNome?: string = '';

   // Variáveis de controle de carregamento e erros
   isLoading = false;
   errorMessage = '';
 
   constructor(
     private _medicaoControllerService: MedicoesService,
     private _contratoControllerService: ContratosService,
     private fb: FormBuilder,
     private route: ActivatedRoute,    
     private _toastService: ToastService,
     public _boletimControllerService: BoletimService,
     private auth: AuthService, 
     private _prefeituraControllerService: PrefeituraService,
     private readonly aesEncryptDecript: AESEncryptDecriptService,
     public _projetoControllerService: ProjetoService,
   ) {}
 
   async ngOnInit() {
     this.isLoading = true;
 
     this.route.paramMap.subscribe(params => {
       this.contratoId = params.get('contratoId')!;
       this.medicaoId = params.get('medicaoId')!;
       this.clienteId = params.get('clienteId')!;
       this.projetoId = params.get('projetoId')!;
     });
     
     var idPrefeituraUser = this.auth.getCookie("_idPrefeitura");
 
 
     //this.createForm();
     var idPrefeituraUser = this.auth.getCookie("_idPrefeitura");
     
     if(idPrefeituraUser){
       idPrefeituraUser = this.aesEncryptDecript.decrypt(idPrefeituraUser);
       if(idPrefeituraUser){
         await this.buscarPrefeitura(Number(idPrefeituraUser));
       }
       else{
         await this.buscarPrefeituras();
       }
     }else{
       await this.buscarPrefeituras();
     }
     //await this.buscarListaContratos();
 
     if(this.contratoId != '0' && this.medicaoId != '0' && this.clienteId != '0'){
       this.contratoSelecionadoId = Number(this.contratoId);
       this.medicaoSelecionado = Number(this.medicaoId);
       this.prefeituraSelecionadoId = Number(this.clienteId);
       this.projetoSelecionadoId = Number(this.projetoId);

       await this.onSelectionClienteChangePrefeitura(this.prefeituraSelecionadoId);
 
       await this.onSelectionChange(this.contratoSelecionadoId);

       await this.onSelectionProjetoChange(this.projetoSelecionadoId);

       this.isEnabledInputs = true;
     }
 
     this.enableMedicao = false;
     this.enableContrato = false;
     this.isLoading = false;
   }
 
   async buscarPrefeitura(id: number){
     await this._prefeituraControllerService.BuscarPrefeitura(id)
     .then((result) => {
       this.listaPrefeitura = [];
       this.listaPrefeitura.push(result);
     })
     .catch(() => {
       this._toastService.mensagemError("Erro ao buscar prefeitura!");
     })
     .finally(() =>{
       this.isLoading = false;
     });
   }
 
   async buscarProjetos() {
    const projetoRequest: ProjetoRequest = {
          nome: '',
          pagina: 1,
          itemsPorPagina: 1000000
    };

    await this._projetoControllerService.BuscarTodosProjetos(projetoRequest)
    .then((res) => {
      this.listaProjetos = res.data;
    })
    .catch((erro) => {
      console.error(erro);
      this._toastService.mensagemError('Erro ao buscar projetos!');
    });
  }

   async buscarPrefeituras() {
     var prefeituraRequest : PrefeituraFilter = new PrefeituraFilter();
 
     prefeituraRequest.itemsPorPagina = 1000000;
     prefeituraRequest.pagina = 1
     prefeituraRequest.nome = "";
 
     await this._prefeituraControllerService.BuscarTodasPrefeituras(prefeituraRequest)
     .then((result) => {
       this.listaPrefeitura = result.data;
     })
     .catch(() => {
       this.isLoading = false;
       this._toastService.mensagemError("Erro ao buscar prefeitura!");
     })
     .finally(() =>{
     });
   }
 
   createForm(){
         this.form = this.fb.group({
           contratoId: [{ value: 0}, Validators.required],
           medicaoId: [{ value: 0, disabled: true }, Validators.required]
         });
     }
 
   async buscarListaContratos() {
       var contratosFilter : BuscarContratosRequest = new BuscarContratosRequest();
           contratosFilter.itemsPorPagina = 1000000;
           contratosFilter.IdProjeto = null;
           contratosFilter.pagina = 1;
 
       await this._contratoControllerService.BuscarTodosContratos(contratosFilter)
       .then((res) => {
         this.listaContratos = res.data;
       })
       .catch((erro) => {
         this.isLoading = false;
         console.error(erro);
         this._toastService.mensagemError('Erro ao buscar medições!');
       });
     }
 
     async buscarMedicoesByProjetoId(projetoId: number) {
       var medicoesRequest : MedicoesRequest = new MedicoesRequest();
       medicoesRequest.idProjeto = projetoId;
       medicoesRequest.itemsPorPagina = 1000000;
       medicoesRequest.pagina = 1;
   
       await this._medicaoControllerService.BuscarTodasMedicoes(medicoesRequest)
       .then((res) => {
         this.listaMedicoes = res.data;
   
         this.groupMedicoes();
       })
       .catch((erro) => {
         this.medicaoSelecionado = 0;
         this.listaMedicoesAgrupados = [];
         this._toastService.mensagemError('Erro ao buscar medições!');
       })
       .finally(() =>{
         this.isLoading = false;
       });
     }
 
     groupMedicoes() {
       const grouped = this.listaMedicoes.reduce((acc, current) => {
         const numeroMedicao = current.numeroMedicao;
   
         // Se ainda não existir um grupo para esse numeroMedicao, cria um novo
         if (!acc[numeroMedicao]) {
           acc[numeroMedicao] = {
             numeroMedicao: numeroMedicao,
             medicaoResponse: []
           };
         }
   
         // Adiciona o MedicoesResponse ao grupo correspondente
         acc[numeroMedicao].medicaoResponse.push(current);
         return acc;
       }, {});
   
       // Agora, agrupamos os dados em um array de BoletimMedicoesResponse
       this.listaMedicoesAgrupados = Object.values(grouped);
   
     }
 
   async onSelectionClienteChangePrefeitura(prefeituraId: number) {
     this.isLoading = true;
     this.enableContrato = true;
     await this.buscarListaContratosPrefeituraId(prefeituraId);
   }
 
   async buscarListaContratosPrefeituraId(prefeituraId: number){
     var contratosFilter : BuscarContratosRequest = new BuscarContratosRequest();
     contratosFilter.itemsPorPagina = 1000000;
     contratosFilter.IdProjeto = null;
     contratosFilter.pagina = 1;
     await this._contratoControllerService.BuscarTodosContratos(contratosFilter)
     .then((result) => {
       this.listaContratos = result.data.filter(x => x.prefeituraId == prefeituraId);
     })
     .finally(() =>{
       this.isLoading = false;
     });
   }
 
   async onSelectionChange(contratoId: number) {
     this.enableProjeto = true;
     this.isLoading = true;
     //this.form.get('medicaoId').enable();
     this.contratoSelecionado = this.listaContratos.find(res => res.idContrato == contratoId);
     console.log(this.contratoSelecionado);
     if(contratoId != undefined && contratoId != null && contratoId != 0)
       await this.getProjectsByClientId();
     this.isLoading = false;
   }
 
   async onSelectionChangeMedicao(medicaoId: number) {
      this.isLoading = true;
      this.projetosNome = "";
     await this.carregarBoletinsMedicao(medicaoId);
   }
 
   async onSelectionProjetoChange(projetoId: number){
    this.isLoading = true;
    this.enableMedicao = true;
    this.projetoSelecionado = this.listaProjetos.find(res => res.idProjeto == projetoId);

    await this.buscarMedicoesByProjetoId(projetoId);
  }

  /*async buscarMedicoesProjeto(contratoId: number) {
    var medicoesRequest : MedicoesRequest = new MedicoesRequest();
    medicoesRequest.idContrato = contratoId;
    medicoesRequest.itemsPorPagina = 1000000;
    medicoesRequest.pagina = 1;

    await this.apiMedicoes.BuscarTodasMedicoes(medicoesRequest)
    .then((res) => {
      this.listaMedicoes = res.data;

      if (this.listaMedicoes.length == 0) {
        this.form.get('medicaoId').disable();
        this._toastService.mensagemError('Lista de medições vazia!');
      }
    })
    .catch((erro) => {
      console.error(erro);
      this._toastService.mensagemError('Erro ao buscar medições!');
    });
  }*/



   
  /* carregarBoletinsDetalhados(medicaoId: number): void {
     this.isLoading = true;
     var boletimMedicaoRequest: BuscarBoletimMedicaoRequest = {
           idMedicao: medicaoId
         }
 
         this._boletimControllerService.BuscarBoletimMedicao(boletimMedicaoRequest)
         .then(async (dados) => {
           if (dados.detalhes.length != 0) {
             this.boletim = dados;
             this.boletimCabecalho = dados.boletimMedicaoCabecalho;
 
             // Verificar o tipo do campo logoTipoImg
             await this.RetornarLogoCliente(this.contratoSelecionado.prefeituraId);
 
             //if (logoTipoImg instanceof File) {
               // Se for um arquivo, converte para URL acessível
               this.logoTipoImgUrl = URL.createObjectURL(logoTipoImg);
             } else if (typeof logoTipoImg === 'string') {
               // Se for uma string, usa diretamente
               this.logoTipoImgUrl = logoTipoImg;
             }
             this.dataSource = dados.detalhes.length == 0 ? [] : dados.detalhes[0].subBoletins;
             this.nomeUnidade = this.boletimCabecalho?.nomeUnidade || '';
             this.valorTotalMedicao = dados.valorTotalMedicao || 0;
           }
           else {
             this._toastService.messageWarning('Sem medição para apresentar!');
           }
         })
         .catch((erro) => {
           console.error(erro);
           this._toastService.mensagemError('Erro ao buscar boletins!');
         })
         .finally(() =>{
           this.isLoading = false;
         });
   }*/
 
  async carregarBoletinsMedicao(medicaoId: number) {
     // this.boletimService.getBoletinsMedicao().subscribe({
     //   next: (dados) => {
     //     if (dados) {
     //       this.boletimCabecalho = dados.boletimMedicaoCabecalho;
 
     //       // Verificar o tipo do campo logoTipoImg
     //       const logoTipoImg = this.boletimCabecalho?.logoTipoImg;
 
     //       if (logoTipoImg instanceof File) {
     //         // Se for um arquivo, converte para URL acessível
     //         this.logoTipoImgUrl = URL.createObjectURL(logoTipoImg);
     //       } else if (typeof logoTipoImg === 'string') {
     //         // Se for uma string, usa diretamente
     //         this.logoTipoImgUrl = logoTipoImg;
     //       }
 
     //       this.nomeUnidade = this.boletimCabecalho?.nomeUnidade;
     //       this.valorTotalMedicao = dados.valorTotalMedicao;
     //       this.dataSource = dados.subBoletins;
     //     }
     //     this.isLoading = false;
     //   },
     //   error: (erro) => {
     //     const message = 'Erro ao carregar os dados do boletim: '
     //     console.error(message, erro);
     //     this.isLoading = false;
     //   }
     // });
     this.dadosSeparadosProjeto = [];
     this.listaMedicoesSelecionadasAgrupados = this.listaMedicoesAgrupados.filter(x => x.numeroMedicao == this.medicaoSelecionado)[0];
     
     this.listaMedicoesSelecionadasAgrupados.medicaoResponse.forEach(async element => {    
       var boletimDetalhadoRequest: BuscarBoletimDetalhadoRequest = {
         idMedicao: element.idMedicoesProjeto
       }
       //Se tornou boletim geral
       await this._boletimControllerService.BuscarBoletimGeral(boletimDetalhadoRequest)
       .then(async (dados) => {
         if (dados.detalhes.length != 0) {
           this.boletim = dados;
           //Se tornou boletim geral
           this.boletimCabecalho = dados.boletimGeralCabecalho;
 
           console.log(this.contratoSelecionado);
           // Verificar o tipo do campo logoTipoImg
           await this.RetornarLogoCliente(this.contratoSelecionado.prefeituraId);
 
           /*if (logoTipoImg instanceof File) {
             // Se for um arquivo, converte para URL acessível
             this.logoTipoImgUrl = URL.createObjectURL(logoTipoImg);
           } else if (typeof logoTipoImg === 'string') {
             // Se for uma string, usa diretamente
             this.logoTipoImgUrl = logoTipoImg;
           }*/
           dados.detalhes[0].subBoletins = (dados.detalhes[0].subBoletins.filter(x => parseFloat(x.unidade) != 0));
           this.dataSource = dados.detalhes.length == 0 ? [] : dados.detalhes[0].subBoletins;
 
           var projeto = new SubBoletim();
           projeto.descricao = dados.detalhes[0].projeto;
           this.projetosNome += this.projetosNome == '' ? projeto.descricao :', '+projeto.descricao;

           //this.dataSource.unshift(projeto);
 
           this.dadosSeparadosProjeto = this.dadosSeparadosProjeto.concat(this.dataSource);
 
           this.agruparEDistribuirQuantidades();
 
           this.dadosSeparadosProjeto.sort((a, b) => this.compareVersions(a.numero, b.numero));
 
           this.agruparPorDigitoInicial();
 
           this.nomeUnidade = this.boletimCabecalho?.nomeUnidade || '';
           this.valorTotalMedicao = dados.valorTotalMedicao || 0;
         }
         else {
           this._toastService.messageWarning('Sem medição para apresentar!');
         }
       })
       .catch((erro) => {
         console.error(erro);
         this._toastService.mensagemError('Erro ao buscar boletins!');
       })
       .finally(()=>{
        this.isLoading = false;
       });
 
     });
   }
 
   agruparEDistribuirQuantidades(): void {
     const dadosAgrupados = this.dadosSeparadosProjeto.reduce((acc, item) => {
       const chave = `${item.numero}-${item.descricao}`;  // Chave única para numero e descricao
 
       // Se o item já existir no acumulador, soma a quantidade
       if (acc[chave]) {
 
 
         var unidadesSomadas = Number(item.unidade) + Number(acc![chave].unidade) ;
         acc[chave].unidade = unidadesSomadas.toString();
 
       } else {
         // Caso contrário, adiciona um novo item ao acumulador
         acc[chave] = { ...item };  // Adiciona uma cópia do item
       }
 
       return acc;
     }, {});
 
     // Agora 'dadosAgrupados' será um objeto com as chaves como "numero-descricao"
     // Transformando-o de volta em um array
     this.dadosSeparadosProjeto = Object.values(dadosAgrupados);
 
   }
 
   // Função para agrupar os dados e adicionar o dígito inicial
   agruparPorDigitoInicial(): void {
     // Agrupar os dados por dígito inicial (primeiro dígito do 'numero')
     const agrupadosPorDigito: { [key: string]: SubBoletim[] } = {}; // Tipando explicitamente
 
     // Agrupando os dados por dígito inicial
     this.dadosSeparadosProjeto.forEach(item => {
       if(item.numero){
       const digitoInicial = item.numero.split('.')[0];  // Divide pelo ponto e pega a primeira parte
 
       // Se o dígito inicial já existir no acumulador, adiciona o item
       if (!agrupadosPorDigito[digitoInicial]) {
         agrupadosPorDigito[digitoInicial] = [];  // Cria o grupo se não existir
       }
       agrupadosPorDigito[digitoInicial].push(item);
     }
     });
 
     // Agora, vamos percorrer os grupos e adicionar o campo 'digitoInicial' no primeiro item de cada grupo
     const dadosAgrupados: SubBoletim[] = [];
 
     // Iterando diretamente pelas chaves do objeto agrupadosPorDigito
     for (const digitoInicial in agrupadosPorDigito) {
       if (agrupadosPorDigito.hasOwnProperty(digitoInicial)) {
         const grupo = agrupadosPorDigito[digitoInicial];
 
         // Adiciona o 'digitoInicial' no primeiro item do grupo
         if (grupo.length > 0) {
           var nomeGrupo = new SubBoletim();
           nomeGrupo.descricao = digitoInicial;
           grupo.unshift(nomeGrupo);
         }
 
         // Adiciona o grupo inteiro ao array final
         dadosAgrupados.push(...grupo);
       }
     }
 
     // Agora, o array dadosAgrupados tem os dados agrupados com o dígito inicial no primeiro item de cada grupo
     this.dadosSeparadosProjeto = dadosAgrupados;
 
   }
 
   async RetornarLogoCliente(clienteId: number): Promise<void> {
     await this._prefeituraControllerService.BuscarPrefeitura(clienteId)
     .then((res) => {
       if (res) {
         this.logoTipoImgUrl = res.logo;
         this.nomePrefeitura = res.nome;
       }
     })
     .catch((erro) => {
       console.error(erro);
       this._toastService.mensagemError('Erro ao buscar logo cliente!');
     });
   }
 
   // Método para gerar o PDF
   async generatePDF() {
     const pdf = new jsPDF('landscape', 'pt', 'a4');
     pdf.html(this.element.nativeElement, {
       callback: (doc) => {
         doc.save('boletim-geral.pdf');
       },
       x: 15,
       y: 13,
       html2canvas: {
         scale: 0.55,
         useCORS: true,
         logging: true,
         letterRendering: true
       }
     });
   }
 
   compareVersions(v1: string, v2: string): number {
   
     if(v2 && v1){
       const parts1 = v1.split('.').map(Number);
       const parts2 = v2.split('.').map(Number);
 
       // Garantir que ambas as versões tenham o mesmo comprimento, preenchendo com 0 onde necessário
       while (parts1.length < parts2.length) {
         parts1.push(0);
       }
       while (parts2.length < parts1.length) {
         parts2.push(0);
       }
 
       // Comparar as partes da versão
       for (let i = 0; i < parts1.length; i++) {
         if (parts1[i] < parts2[i]) {
           return -1;  // v1 é menor
         }
         if (parts1[i] > parts2[i]) {
           return 1;   // v1 é maior
         }
       }
   }
     return 0;  // versões são iguais
   }
 
 
   calcularValorTotalItemBoletim(unidade: string, precoComBdi: number){
     var quantidadeItem = parseFloat(unidade);
     return (precoComBdi * quantidadeItem).toFixed(2);
   }
 
 
   calcularSomaValorTotal(){
     let valorSaldoSomado = 0;
     this.dadosSeparadosProjeto.forEach( x => {
       if(x.precoComBdi && x.unidade){
         var quantidadeItem = parseFloat(x.unidade);
         valorSaldoSomado += quantidadeItem * x.precoComBdi;
       }
     })
 
     return valorSaldoSomado.toFixed(2);
   }

   
  async getProjectsByClientId() {
    const projetoRequest: ProjetoRequest = {
      nome: '',
      pagina: 1,
      itemsPorPagina: 1000000,
      idContrato: this.contratoSelecionadoId
    };

    await this._projetoControllerService.BuscarTodosProjetos(projetoRequest)
    .then(async (res) => {
      //let projetoModel: ProjetoResponse[] = [];

      /*let prefeitura = this.listaPrefeitura.filter(x => {
        x.idPrefeitura == this.prefeituraSelecionadoId
      })

      let projetosCliente = res.data.filter(x => x.nomePrefeitura == prefeitura[0].nome)
*/
      this.listaProjetos = res.data;
      /*projetosCliente.forEach((res) => {
        let prefeitura = res.contratos.length == 0 ? null : 
        this.listaPrefeitura.find(resPf => resPf.idPrefeitura == res.contratos[0].contratos.prefeituraId);

        const projeto: ProjetoResponse = {
          idProjeto: res.idProjeto,
          nomeProjeto: res.nomeProjeto,
          nomePrefeitura: prefeitura ? prefeitura.nome : '',
          codigoProjeto: res.codigoProjeto,
          nomeContrato: res.contratos.length != 0 ? res.contratos[0].contratos.numeroContrato : '',
          contratos: res.contratos
        };

        projetoModel.push(projeto);
      });
      this.listaProjetos = projetoModel;
      this.dataSource.data = this.listaProjetos;*/
    })
    .catch((erro) => {
      console.error(erro);
      this._toastService.mensagemError('Erro ao buscar projetos!');
    });
  }

  obterProjetoById(){
    return this.listaProjetos.find(x => x.idProjeto == this.projetoSelecionadoId).nomeProjeto;
  }
}
