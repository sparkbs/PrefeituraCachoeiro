using Microsoft.AspNetCore.Mvc.Filters;
using PrefeituraCachoeiro.Aplicacao.Interfaces;
using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Middlewares
{
    [ExcludeFromCodeCoverage]
    public sealed class ApplicationUserFilter : IAsyncActionFilter
    {
        private readonly IApplicationUser _applicationUser;

        public ApplicationUserFilter(IApplicationUser applicationUser)
        {
            _applicationUser = applicationUser;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var userId = Convert.ToInt32(context.HttpContext?.User?.FindFirst("idUsuario")?.Value);

            _applicationUser.UserId = userId;

            await next();
        }
    }
}