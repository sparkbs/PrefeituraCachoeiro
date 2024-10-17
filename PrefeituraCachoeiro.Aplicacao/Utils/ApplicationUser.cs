using PrefeituraCachoeiro.Aplicacao.Interfaces;
using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Utils
{
    [ExcludeFromCodeCoverage]
    public class ApplicationUser : IApplicationUser
    {
        public int UserId { get; set; }
    }
}