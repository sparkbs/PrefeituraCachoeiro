using Amazon.Extensions.NETCore.Setup;
using Amazon.S3;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using PrefeituraCachoeiro.Aplicacao.Interfaces;
using PrefeituraCachoeiro.Aplicacao.Servicos;
using PrefeituraCachoeiro.Aplicacao.Utils;
using PrefeituraCachoeiro.Dados;
using PrefeituraCachoeiro.Dados.Interfaces;
using PrefeituraCachoeiro.Dados.Repositorios;
using RestSharp;
using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Ioc
{
    [ExcludeFromCodeCoverage]
    public static class DI
    {
        public static void AddServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddSingleton<IRestClient>(serviceProvider =>
            {
                var clientOptions = new RestClientOptions()
                {
                };

                return new RestClient(clientOptions);
            });

            services.AddDefaultAWSOptions(new AWSOptions
            {
                Credentials = new Amazon.Runtime.BasicAWSCredentials(
                    configuration["AccessKey"],
                    configuration["SecretKey"]
                ),
                Region = Amazon.RegionEndpoint.GetBySystemName(configuration["Region"])
            });

            services.AddAWSService<IAmazonS3>();
            services.AddSingleton(configuration);
            services.AddScoped<IApplicationUser, ApplicationUser>();
            services.AddScoped<IProjetoService, ProjetoService>();
            services.AddScoped<IGruposService, GruposService>();
            services.AddScoped<ISegurancaService, SegurancaService>();
            services.AddScoped<IUsuariosService, UsuariosService>();
            services.AddScoped<ILoginService, LoginService>();
            services.AddScoped<IUsuariosGruposService, UsuariosGruposService>();
            services.AddScoped<ITiposPermissoesService, TiposPermissoesService>();
            services.AddScoped<IContratosService, ContratosService>();
            services.AddScoped<IPermissoesService, PermissoesService>();
            services.AddScoped<IMedicoesProjetoService, MedicoesProjetoService>();
            services.AddScoped<IPrefeituraService, PrefeituraService>();
            services.AddDbContext<ContextoDb>(options => options.UseNpgsql(configuration["CONNECTION_STRING"]).EnableDetailedErrors());
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            services.AddScoped<IProjetoRepository, ProjetoRepository>();
            services.AddScoped<IGruposRepository, GruposRepository>();
            services.AddScoped<IUsuariosRepository, UsuariosRepository>();
            services.AddScoped<IUsuariosGruposRepository, UsuariosGruposRepository>();
            services.AddScoped<ITiposPermissoesRepository, TiposPermissoesRepository>();
            services.AddScoped<IPermissoesRepository, PermissoesRepository>();
            services.AddTransient<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IContratosRepository, ContratosRepository>();
            services.AddScoped<IItemRepository, ItemRepository>();
            services.AddScoped<IMedicoesProjetoRepository, MedicoesProjetoRepository>();
            services.AddScoped<ILogStatusMedicaoRepository, LogStatusMedicaoRepository>();
            services.AddScoped<IItemsMedicoesProjetoRepository, ItemsMedicoesProjetoRepository>();
            services.AddScoped<IItemsContratoRepository, ItemsContratoRepository>();
            services.AddScoped<IPrefeituraRepository, PrefeituraRepository>();
            services.AddScoped<IS3Service, S3Service>();
            services.AddScoped<IEmpresaRepository, EmpresaRepository>();
            services.AddScoped<IEmpresaService, EmpresaService>();
            services.AddScoped<ISequenceService, SequenceService>();
            services.AddScoped<IParametrosSistemaRepository, ParametrosSistemaRepository>();
            services.AddScoped<IParametrosSistemaService, ParametrosSistemaService>();
            services.AddScoped<IArquivosMedicoesProjetoRepository, ArquivosMedicoesProjetoRepository>();
            services.AddScoped<IArquivosMedicoesProjetoService, ArquivosMedicoesProjetoService>();
            services.AddScoped<IOrigemRepository, OrigemRepository>();
            services.AddScoped<ITemplateRepository, TemplateRepository>();
            services.AddScoped<IQuantidadeRepository, QuantidadeRepository>();
            services.AddScoped<IArquivosContratoRepository, ArquivosContratoRepository>();
            services.AddScoped<IAditivosRepository, AditivosRepository>();
            services.AddScoped<IAditivosService, AditivosService>();
            services.AddScoped<IItemsAditivoRepository, ItemsAditivoRepository>();
            services.AddScoped<IArquivosAditivoRepository, ArquivosAditivoRepository>();
        }
    }
}