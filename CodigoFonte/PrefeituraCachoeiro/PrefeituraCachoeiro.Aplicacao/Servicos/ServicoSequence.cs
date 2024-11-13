using Microsoft.EntityFrameworkCore;
using PrefeituraCachoeiro.Aplicacao.Interfaces;
using PrefeituraCachoeiro.Dados;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Aplicacao.Servicos
{
    public class SequenceService : ISequenceService
    {
        private readonly ContextoDb _context;

        public SequenceService(ContextoDb context)
        {
            _context = context;
        }

        public async Task<int> GetNextValueFromContratoSequenceAsync()
        {
            string sequenceName = "tb_contratos_idcontrato_seq";  // Nome da sua sequence no PostgreSQL

            // Executando a consulta SQL diretamente usando ExecuteSqlRaw
            var sql = $"SELECT nextval('{sequenceName}')";

            // ExecuteSqlRaw retorna o número de linhas afetadas (não pode ser usado para valores escalares)
            // Para obter um valor escalar, use ExecuteSqlRawAsync para retornar o resultado
            var result = await _context.Database.ExecuteSqlRawAsync(sql);

            // O valor será retornado como um escalar, então podemos usar ExecuteSqlRawAsync com FromSqlRaw (para valor escalar)
            var value = await _context.Set<DbSequenceResult>().FromSqlRaw(sql).Select(r => r.Value).FirstOrDefaultAsync();

            return value;
        }
    }
}