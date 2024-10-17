using ConsoleTeste;

while (true)
{
    Console.Clear();
    Console.WriteLine("Digite a opção para poder testar");
    Console.WriteLine("1 - Criar Medições de Projeto");
    Console.WriteLine("2 - Atualizar Medições de Projeto");
    Console.WriteLine("9 - Sair");

    var _opcao = Console.ReadLine().Trim();

    if (_opcao == "1")
    {
        await TesteMedicoesProjeto.CriarMedicao();
        Console.WriteLine("Pressione qualquer tecla para continuar...");
        Console.ReadKey();
    }
    else if (_opcao == "2")
    {
        await TesteMedicoesProjeto.AlterarMedicao();
        Console.WriteLine("Pressione qualquer tecla para continuar...");
        Console.ReadKey();
    }
    else if (_opcao == "9")
    {
        Console.Clear();
        break;
    }
    else {
        Console.WriteLine("Opção inválida.Digite novamente");
        Console.WriteLine("Pressione qualquer tecla para continuar...");
        Console.ReadKey();
    }
}