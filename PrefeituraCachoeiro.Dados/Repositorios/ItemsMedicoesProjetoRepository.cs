using Microsoft.EntityFrameworkCore;
using PrefeituraCachoeiro.Dados.Interfaces;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Repositorios
{
    public class ItemsMedicoesProjetoRepository: IItemsMedicoesProjetoRepository
    {
        private readonly ContextoDb _context;

        public ItemsMedicoesProjetoRepository(ContextoDb context)
        {
            _context = context;
        }

        public async Task<bool> DeletarAsync(int idMedicoesProjeto, CancellationToken cancellationToken)
        {
            var _listaItemsMedicoes = await _context.ItemsMedicoesProjetoEntidade.Where(i => i.IdMedicoesProjeto == idMedicoesProjeto).ToListAsync();

            _context.ItemsMedicoesProjetoEntidade.RemoveRange(_listaItemsMedicoes);
            await _context.SaveChangesAsync(cancellationToken);

            return (true);
        }

        public async Task<List<ItemsMedicoesProjetoEntidade>> BuscarTodosAsync(int idMedicoesProjetos, CancellationToken cancellationToken)
        {
            var query = _context.ItemsMedicoesProjetoEntidade.Where(x => x.DataDelecao == null);

            query = query.Where(x => x.IdMedicoesProjeto == idMedicoesProjetos);

            return (await query.ToListAsync());
        }
    }
}