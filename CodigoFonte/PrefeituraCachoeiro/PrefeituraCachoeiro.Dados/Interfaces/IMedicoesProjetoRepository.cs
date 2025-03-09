using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Interfaces
{
    public interface IMedicoesProjetoRepository
    {
        Task<PaginatedEntity<MedicoesProjetoEntidade>> BuscarTodosAsync(MedicoesProjetoFilter filter, UsuariosEntidade? usuarioLogado, CancellationToken cancellationToken);
        Task<MedicoesProjetoEntidade?> BuscarPorIdAsync(int idMedicoesProjeto, UsuariosEntidade? usurioLogado, CancellationToken cancellationToken);
        Task<MedicoesProjetoEntidade> InserirAsync(MedicoesProjetoEntidade medicoesProjeto, CancellationToken cancellationToken);
        Task<MedicoesProjetoEntidade> AtualizarAsync(MedicoesProjetoEntidade medicoesProjeto, CancellationToken cancellationToken);
        Task<List<MedicoesProjetoEntidade>> BuscarBoletimMedicaoAsync(int idProjeto, UsuariosEntidade? usuarioLogado, CancellationToken cancellationToken);
        Task<List<MedicoesProjetoEntidade>> BuscarBoletimProjetoAsync(int idMedicao, int idProjeto, UsuariosEntidade? usuarioLogado, CancellationToken cancellationToken);
        Task<List<MedicoesProjetoEntidade>> BuscarBoletimMedicaoDetalhadoAsync(int idMedicao, UsuariosEntidade? usuarioLogado, CancellationToken cancellationToken);
        Task<MedicoesProjetoEntidade?> BuscarUltimaMedicaoPorContratoIdAsync(int idContrato, UsuariosEntidade? usuarioLogado, CancellationToken cancellationToken);
    }
}