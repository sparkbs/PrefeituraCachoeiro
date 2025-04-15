using AutoMapper;
using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes;
using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Aplicacao.AutoMapper
{
    public class Mapeamentos : Profile
    {
        public Mapeamentos()
        {
            CreateMap<ContratosProjetosEntidade, ContratosProjetoDto>();
            CreateMap<ProjetoEntidade, CriarProjetoResponse>();
            CreateMap<ProjetoEntidade, AtualizarProjetoResponse>();
            CreateMap<ProjetoEntidade, ProjetoResponse>()
                .ForMember(dest => dest.Contratos, static opt => opt.MapFrom(src => src.Contratos.Select(cp => new ContratosProjetoDto()
                {
                    IdContrato = cp.IdContrato,
                    IdContratoProjeto = cp.IdContratoProjeto,
                    IdProjeto = cp.IdProjeto,
                    Contratos = new ContratoSimplesResponse()
                    {
                        Aditivo = cp.Contratos.Aditivo,
                        DataAssinaturaAditivo = cp.Contratos.DataAssinaturaAditivo,
                        DataContrato = cp.Contratos.DataContrato,
                        DataInicio = cp.Contratos.DataInicio,
                        DataTermino = cp.Contratos.DataTermino,
                        DataValidadeAditivo = cp.Contratos.DataValidadeAditivo,
                        EmpresaId = cp.Contratos.EmpresaId,
                        Gerente = cp.Contratos.Gerente,
                        IdContrato = cp.Contratos.IdContrato,
                        NumeroContrato = cp.Contratos.NumeroContrato,
                        PrefeituraId = cp.Contratos.PrefeituraId,
                        TipoAditivo = cp.Contratos.TipoAditivo,
                        TipoContratacao = cp.Contratos.TipoContratacao,
                        Valor = cp.Contratos.Valor,
                        ValorSaldoRestante = cp.Contratos.ValorSaldoRestante,
                        ValorTotalMedido = cp.Contratos.ValorTotalMedido,
                        ValorTotalPrevisto = cp.Contratos.ValorTotalPrevisto,
                        ValorTotalSolicitado = cp.Contratos.ValorTotalSolicitado,
                    }
                })));

            CreateMap<GruposEntidade, CriarGrupoResponse>();
            CreateMap<GruposEntidade, AtualizarGrupoResponse>();
            CreateMap<GruposEntidade, GruposResponse>();
            CreateMap<UsuariosEntidade, CriarUsuarioResponse>();
            CreateMap<UsuariosEntidade, AtualizarUsuarioResponse>();
            CreateMap<UsuariosEntidade, UsuariosResponse>();
            CreateMap<UsuariosGruposEntidade, CriarUsuariosGruposResponse>();
            CreateMap<TipoPermissoesEntidade, TiposPermissoesResponse>();
            CreateMap<PermissoesEntidade, PermissoesResponse>();
            CreateMap<PermissoesEntidade, CriarPermissoesResponse>();
            CreateMap<ContratosEntidade, ContratosResponse>()
                .ForMember(dest => dest.Projetos, opt => opt.MapFrom(src => src.Projetos.Select(cp => new ProjetoResponse
                {
                    IdProjeto = cp.Projetos.IdProjeto,
                    NomeProjeto = cp.Projetos.NomeProjeto
                })));
            CreateMap<ContratosEntidade, CriarContratoResponse>();
            CreateMap<ContratosEntidade, AtualizarContratosResponse>();
            CreateMap<ItemsContratoEntidade, ItemsContratoResponse>();
            CreateMap<ItemsContratoEntidade, ItemsContratoSimplesResponse>();
            CreateMap<ItemEntidade, ItemResponse>();
            CreateMap<ItemEntidade, ItemSimplesResponse>();
            CreateMap<OrigemEntidade, OrigemResponse>();
            CreateMap<QuantidadeEntidade, QuantidadeResponse>();
            CreateMap<MedicoesProjetoEntidade, CriarMedicoesProjetoResponse>();
            CreateMap<MedicoesProjetoEntidade, AtualizarMedicoesProjetoResponse>();
            CreateMap<MedicoesProjetoEntidade, MedicoesProjetoResponse>();
            CreateMap<ItemsMedicoesProjetoEntidade, ItemsMedicoesProjetoResponse>();
            CreateMap<StatusMedicaoEntidade, StatusMedicaoResponse>();
            CreateMap<LogStatusMedicaoEntidade, LogStatusMedicaoResponse>();
            CreateMap<PrefeituraEntidade, PrefeituraResponse>();
            CreateMap<EmpresaEntidade, EmpresaResponse>();
            CreateMap<EmpresaEntidade, CriarEmpresaResponse>();
            CreateMap<EmpresaEntidade, AtualizarEmpresaResponse>();
            CreateMap<PrefeituraEntidade, PrefeituraResponse>();
            CreateMap<PrefeituraEntidade, CriarPrefeituraResponse>();
            CreateMap<PrefeituraEntidade, AtualizarPrefeituraResponse>();
            CreateMap<ParametrosSistemaEntidade, ParametrosSistemaResponse>();
            CreateMap<ArquivosMedicoesProjetoEntidade, ArquivosMedicoesProjetoResponse>()
               .ForPath(i => i.Arquivo, x => x.MapFrom(i => Path.GetFileName(i.ArquivoMedicao)));
            CreateMap<AditivosEntidade, CriarAditivoResponse>();
            CreateMap<AditivosEntidade, AditivosResponse>();
            CreateMap<ItemsAditivoEntidade, ItemsAditivoSimpleResponse>();
            CreateMap<ArquivosContratosEntidade, ArquivoContratoResponse>()
               .ForPath(i => i.Arquivo, x => x.MapFrom(i => Path.GetFileName(i.ArquivoContrato)));
            CreateMap<ArquivosAditivoEntidade, ArquivoAditivoResponse>()
               .ForPath(i => i.Arquivo, x => x.MapFrom(i => Path.GetFileName(i.ArquivoAditivo)));
        }
    }
}