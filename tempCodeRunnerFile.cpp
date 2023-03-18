string s = to_string(x);
    int sum = 0;
    for (int i = 0; i < s.length() / 2; i++)
    {
        if (s[i] == s[s.length()-1 - i])
        {
            sum++;
        }
        cout<<i<<" "<<sum;
    }
    if (sum == floor(s.length() / 2))
    {
        return true;
    }
    else
        return sum;