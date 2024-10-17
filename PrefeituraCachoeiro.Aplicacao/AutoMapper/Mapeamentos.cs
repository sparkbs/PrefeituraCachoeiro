using AutoMapper;
using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes;
using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;
using PrefeituraCachoeiro.Dominio.Dto;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Aplicacao.AutoMapper
{
    public class Mapeamentos : Profile
    {
        public Mapeamentos()
        {
            CreateMap<ProjetoEntidade, CriarProjetoResponse>();
            CreateMap<ProjetoEntidade, AtualizarProjetoResponse>();
            CreateMap<ProjetoEntidade, ProjetoResponse>();
            CreateMap<GruposEntidade, CriarGrupoResponse>();
            CreateMap<GruposEntidade, AtualizarGrupoResponse>();
            CreateMap<GruposEntidade, GruposResponse>();
            CreateMap<UsuariosEntidade, CriarUsuarioResponse>();
            CreateMap<UsuariosEntidade, AtualizarUsuarioResponse>();
            CreateMap<UsuariosEntidade, UsuariosResponse>();
            CreateMap<UsuariosGruposEntidade, CriarUsuariosGruposResponse>();
            CreateMap<TipoPermissoesEntidade, TiposPermissoesResponse>();
            CreateMap<PermissoesEntidade, CriarPermissoesResponse>();
            CreateMap<ContratosEntidade, ContratosResponse>();
            CreateMap<ContratosEntidade, CriarContratoResponse>();
            CreateMap<ContratosEntidade, AtualizarContratosResponse>();
            CreateMap<ProjetoEntidade, ProjetoResponse>();
            CreateMap<ItemsContratoEntidade, ItemsContratoResponse>();
            CreateMap<ItemEntidade, ItemResponse>();
            CreateMap<OrigemEntidade, OrigemResponse>();
            CreateMap<QuantidadeEntidade, QuantidadeResponse>();
            CreateMap<MedicoesProjetoEntidade, CriarMedicoesProjetoResponse>();
            CreateMap<MedicoesProjetoEntidade, AtualizarMedicoesProjetoResponse>();
            CreateMap<MedicoesProjetoEntidade, MedicoesProjetoResponse>();
            CreateMap<ItemsMedicoesProjetoEntidade, ItemsMedicoesProjetoDto>();
            CreateMap<ItemsMedicoesProjetoEntidade, ItemsMedicoesProjetoResponse>();
            CreateMap<ItemsContratoEntidade, ItemsContratoDto>();
            CreateMap<StatusMedicaoEntidade, StatusMedicaoDto>();
            CreateMap<StatusMedicaoEntidade, StatusMedicaoResponse>();
            CreateMap<LogStatusMedicaoEntidade, LogStatusMedicaoResponse>();
        }
    }
}