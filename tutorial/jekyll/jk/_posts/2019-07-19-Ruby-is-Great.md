---
layout: post
title: Rubyは最高!
tags: [ruby, language]
excerpt: A dynamic, open source programming language with a focus on simplicity and productivity.
---

## Rubyとは
Rubyは、手軽なオブジェクト指向プログラミングを実現するための種々の機能を持つオブジェクト指向スクリプト言語です。

## Try Ruby
{%highlight ruby linenos%}
class Person
    def initialize(name)
        @name = name
    end

    def hello
        "Hello, friend!\nMy name is #{@anme}!"
    end

charie = Person.new('Charlie')
puts charlie.hello

# >> Hello, friend!
# >> My name is Charlie!
{%endhighlight%}


