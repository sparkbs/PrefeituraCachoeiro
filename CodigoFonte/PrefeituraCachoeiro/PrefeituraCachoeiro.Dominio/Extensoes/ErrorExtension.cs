using Microsoft.AspNetCore.Mvc;
using PrefeituraCachoeiro.Dominio.Errors;
using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Dominio.Extensoes
{
    public static class ErrorExtension
    {
        public static IActionResult ToHttpResponseError(this Error error) => error switch
        {
            NotFoundError => new NotFoundObjectResult(error),
            NoRecordsError => new OkObjectResult(error),
            _ => new BadRequestObjectResult(error),
        };
    }
}