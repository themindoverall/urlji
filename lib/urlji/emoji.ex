defmodule Urlji.EmojiLoader do
  def parse(filename: filename) do
    {:ok, file} = File.read(filename)

    file
    |> String.split("\n", trim: true)
    |> Enum.map(fn line -> line |> String.split("#") |> Enum.at(0) end)
    |> Enum.filter(fn line -> line != "" end)
    |> Enum.map(fn line -> line |> String.split(";") |> Enum.map(&String.trim/1) end)
    |> Enum.filter(fn line -> Enum.at(line, 1) == "fully-qualified" end)
    |> Enum.map(&Enum.at(&1, 0))
    |> Enum.map(fn line -> line |> String.split |> Enum.map(&String.to_integer(&1, 16)) end)
    |> Enum.map(&to_string/1)
  end

  defmacro __using__(filename: filename) do
    emojis = parse(filename: filename)

    quote do
      def emoji do
        unquote(emojis)
      end
    end
  end
end

defmodule Urlji.Emoji do
  use Urlji.EmojiLoader, filename: "./priv/emoji/emoji-11.0-test.txt"

  def random_emoji do
    emoji()
    |> Enum.random
  end
end
