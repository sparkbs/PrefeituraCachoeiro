using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Diagnostics.CodeAnalysis;
using System.Reflection;

namespace PrefeituraCachoeiro.Api.Configurations
{
    [ExcludeFromCodeCoverage]
    public static class SwaggerConfiguration
    {
        public static void AddSwaggerConfiguration(this IServiceCollection services)
        {
            if (services == null) throw new ArgumentNullException(nameof(services));

            services.AddSwaggerGen(settings =>
            {
                settings.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Gerenciador de Medições de Projetos - API",
                    Version = "v1",
                    Description = "Esta API contem serviços para realizações medições de projetos"
                });

                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);

                settings.IncludeXmlComments(xmlPath);
                ConfigureSecurityDefinition(settings);
                ConfigureSecurityRequirement(settings);
            });
        }

        private static void ConfigureSecurityDefinition(SwaggerGenOptions settings)
        {
            var openApiBearerScheme = new OpenApiSecurityScheme
            {
                Description = "Bearer JWT",
                Type = SecuritySchemeType.Http,
                Name = "authorization",
                In = ParameterLocation.Header,
                Scheme = "bearer"
            };

            settings.AddSecurityDefinition("Bearer", openApiBearerScheme);
        }

        private static void ConfigureSecurityRequirement(SwaggerGenOptions settings)
        {
            var bearerReference = new OpenApiSecurityScheme()
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            };

            var bearerRequirement = new OpenApiSecurityRequirement { { bearerReference, new List<string>() } };

            settings.AddSecurityRequirement(bearerRequirement);
        }
    }
}