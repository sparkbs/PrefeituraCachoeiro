using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Api.Excecoes
{
    [ExcludeFromCodeCoverage]
    [Serializable]
    public class AuthException : Exception
    {
        private const string DefaultErrorMessage = "A autenticação falhou.";

        public AuthException() : base(DefaultErrorMessage) { }

        public AuthException(string message) : base(message) { }

        public AuthException(string message, Exception innerException) : base(message, innerException) { }
    }
}
