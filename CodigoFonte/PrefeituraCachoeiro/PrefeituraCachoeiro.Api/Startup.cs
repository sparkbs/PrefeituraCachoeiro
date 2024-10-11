using Microsoft.AspNetCore.Authorization;
using PrefeituraCachoeiro.Api.Auth;
using PrefeituraCachoeiro.Api.Configurations;
using PrefeituraCachoeiro.Aplicacao.Middlewares;
using PrefeituraCachoeiro.Ioc;

namespace PrefeituraCachoeiro.Api
{
    public static class Startup
    {
        public static IServiceCollection ConfigureServices(this IServiceCollection services, IConfiguration configuration, IWebHostEnvironment webHostEnvironment)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigins", builder => builder
                                      .WithOrigins("*")
                                      .AllowAnyHeader()
                                      .AllowAnyMethod());
            });

            services.AddControllers();
            services.AddServices(configuration);
            services.AddControllers(options =>
            {
                options.Filters.Add<ApplicationUserFilter>();
            });


            services.AddAuthentication("PrefeituraCachoeiroSso")
               .AddScheme<PrefeituraCachoeiroSsoAuthenticationOptions, PrefeituraCachoeiroSsoAuthenticationHandler>("PrefeituraCachoeiroSso", opts => { });

            services.AddAuthorization(options =>
            {
                options.DefaultPolicy = new AuthorizationPolicyBuilder()
                    .AddAuthenticationSchemes("PrefeituraCachoeiroSso")
                    .RequireAuthenticatedUser()
                    .Build();
            });

            services.AddSwaggerConfiguration();
            services.Configure<RouteOptions>(options =>
            {
                options.LowercaseUrls = true;
            });

            return services;
        }

        public static WebApplication Configure(this WebApplication app)
        {
            app.UseCors("AllowSpecificOrigins");
            app.UseSwagger();
            app.UseSwaggerUI(options =>
            {
                options.DocumentTitle = "Prefeitura de Cachoeiro - Gestor de Medições de Projetos";
            });

            app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();

            return app;
        }
    }
}