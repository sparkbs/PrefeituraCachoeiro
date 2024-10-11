using PrefeituraCachoeiro.Aplicacao.Interfaces;
using System.Security.Cryptography;
using System.Text;

namespace PrefeituraCachoeiro.Aplicacao.Servicos
{
    public class SegurancaService: ISegurancaService
    {
        private readonly byte[] salFixado = Encoding.UTF8.GetBytes("PrefeituraCachoeiro2024");

        public string GerarHashSenha(string senha)
        {
            using (var rfc2898 = new Rfc2898DeriveBytes(senha, salFixado, 10000))
            {
                byte[] hash = rfc2898.GetBytes(32);
                byte[] hashComSal = new byte[salFixado.Length + hash.Length];

                Array.Copy(salFixado, 0, hashComSal, 0, salFixado.Length);
                Array.Copy(hash, 0, hashComSal, salFixado.Length, hash.Length);

                return Convert.ToBase64String(hashComSal);
            }
        }
    }
}