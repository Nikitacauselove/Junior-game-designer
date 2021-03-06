# Тестовое задание
В нашей RPG-игре персонаж собирает в инвентаре предметы, полученные тем или иным образом.

Предметы имеют следующие свойства:
- Название
- Редкость (COMMON, UNCOMMON, RARE, LEGENDARY)
- Тип (WEAPON, HELMET, ARMOR, SHIELD)

Результатом выполнения этого задания является скрипт на языке TypeScript, с удобной, легко поддерживаемой архитектурой.
В игру планируется добавить бустерпаки 3-х редкостей: UNCOMMON, RARE, LEGENDARY. Бустерпак редкости **X** должен содержать 5 случайных предметов: 2 редкости **X** и 3 редкости **X-1**, при этом у каждой карты существует вероятность повысить редкость на 1 или более пунктов (p=0.1, 0.01, ...)
## Задание 1:
* Скрипт должен содержать базу из 32 предметов (по 2 предмета каждой редкости каждого типа)
* Скрипт должен также содержать функцию, реализующую открытие бустерпака
* Параметром функции является редкость бустерпака
* Результатом должны быть 5 предметов, выдаваемых этим бустерпаком
## Задание 2:
Игрокам не нравится, когда из бустерпака падает много однотипных предметов (например четыре щита). В связи с этим необходимо ввести новый вид бустерпака (consistent_pack), в котором не выдается более чем два предмета одинакового типа.
## Задание 3:
* Для гарантии сбора коллекции нужно завести новый вид бустерпака (fair_pack) такой, чтобы игрок открыв максимум 24 таких бустерпака редкости **X** получил все предметы редкости **X**.
* Реализовать инвентарь игрока, где будут содержаться все полученные им предметы
* Реализовать функцию выдачи N бустерпаков вида X (N, X - параметры)
