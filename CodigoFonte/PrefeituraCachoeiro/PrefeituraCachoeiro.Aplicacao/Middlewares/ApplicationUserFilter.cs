using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;
using PrefeituraCachoeiro.Aplicacao.Interfaces;
using PrefeituraCachoeiro.Dados.Interfaces;
using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Middlewares
{
    [ExcludeFromCodeCoverage]
    public sealed class ApplicationUserFilter : IAsyncActionFilter
    {
        private readonly IApplicationUser _applicationUser;
        private readonly IHttpContextAccessor _httpContext;
        private readonly IUsuariosRepository _usuariosRepository;
        
        public ApplicationUserFilter(IApplicationUser applicationUser, IHttpContextAccessor httpContext, IUsuariosRepository usuariosRepository)
        {
            _applicationUser = applicationUser;
            _httpContext = httpContext;
            _usuariosRepository = usuariosRepository;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var _login = _httpContext.HttpContext.User.Identity.Name;

            if (_login != null)
            {
                var _cancellationToken = new CancellationToken();
                var _usuario = await this._usuariosRepository.BuscarPorLogingAsync(_login, _cancellationToken);

                this._applicationUser.UserId = _usuario.IdUsuario;
                this._applicationUser.Email = _login;
            }

            await next();
        }
    }
}