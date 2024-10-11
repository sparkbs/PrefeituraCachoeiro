using Microsoft.EntityFrameworkCore.Storage;
using PrefeituraCachoeiro.Dados.Interfaces;

namespace PrefeituraCachoeiro.Dados.Repositorios
{
    public class UnitOfWork(ContextoDb context) : IUnitOfWork
    {
        private readonly ContextoDb _context = context;
        private IDbContextTransaction _currentTransaction;

        public async Task Commit()
        {
            if (_currentTransaction is not null)
                await _currentTransaction.CommitAsync();
        }

        public async Task Rollback()
        {
            if (_currentTransaction is not null)
                await _currentTransaction.RollbackAsync();
        }

        public async Task BeginTransaction()
        {
            if (_context.Database.CurrentTransaction is null)
                _currentTransaction = await _context.Database.BeginTransactionAsync();
        }
    }
}