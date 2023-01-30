namespace Werewolf.Bot.Utilities;

public static class TokenGeneratorUtility
{
    public static string Generate(int length = 6, bool includeDigits = true, bool includeLetters = true)
    {
        var chars = string.Empty;

        if (includeDigits) chars += "0123456789";
        if (includeLetters) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        
        var stringChars = new char[length];
        Random random = new Random();

        for (int i = 0; i < stringChars.Length; i++)
        {
            stringChars[i] = chars[random.Next(chars.Length)];
        }

        return new string(stringChars);
    }
}