using System.Reflection;

namespace PrefeituraCachoeiro.Environment
{
    public static class EnvVariables
    {
        public static string ConnectionString => _("CONNECTION_STRING");
        public static string BucketImagesLogos => _("bucketimageslogos");
        public static string AwsAccessKey => _("AccessKey");
        public static string AwsSecretKey => _("SecretKey");
        public static string AwsRegion => _("Region");

        private static string _(string name)
        {
            var variable = GetEnvironmentVariable(name);

            if (string.IsNullOrEmpty(variable))
            {
                var project = Assembly.GetEntryAssembly().GetName().Name;
                throw new ArgumentNullException($"Variável de ambiente [{name}] não encontrada no projeto [{project}].");
            }
            return variable;
        }

        private static string GetEnvironmentVariable(string name)
        {
            return System.Environment.GetEnvironmentVariable(name)
              ?? System.Environment.GetEnvironmentVariable(name, EnvironmentVariableTarget.User)
              ?? System.Environment.GetEnvironmentVariable(name, EnvironmentVariableTarget.Process)
              ?? System.Environment.GetEnvironmentVariable(name, EnvironmentVariableTarget.Machine);
        }
    }
}
