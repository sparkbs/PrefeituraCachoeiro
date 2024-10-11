using Microsoft.AspNetCore.Http;
using PrefeituraCachoeiro.TratadorControlador.Tratadores;
using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.TratadorControlador
{
    [ExcludeFromCodeCoverage]
    public class ControllerHandler
    {
        private readonly RequestDelegate _next;

        public ControllerHandler(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await ExceptionHandler.HandleExceptionAsync(context, ex);
            }
        }
    }
}
