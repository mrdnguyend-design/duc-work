---
title: "Your SMS cost data is probably wrong, and your ROI is wrong with it"
description: "A warehouse table quietly dropped 25 of 31 days for one store. Every cost number built on it was understated for two months before anyone checked."
pubDate: 2026-09-15
tags: ["SMS", "Data", "Post-mortem"]
draft: true
translationOf: "du-lieu-chi-phi-sms-cua-ban-co-the-dang-sai"
---

<!-- TODO: bài mẫu dựng theo sự cố thật. Anh chỉnh mức độ công khai số liệu
     trước khi bỏ `draft: true`. -->

Every monthly report I write starts the same way: pull revenue, pull cost,
divide. For two months that division was wrong for one of our stores, and
nothing in the pipeline complained.

## What happened

We read SMS cost from a warehouse table that syncs from the platform. In August,
that table held six days of campaign data for one store. The month has
thirty-one.

Nothing errored. The query returned rows. The rows were internally consistent.
The number was just small.

Small cost against correct revenue produces a beautiful ROI. That is the
dangerous failure mode — a broken pipeline that fails toward good news gets
questioned much later than one that fails toward bad news.

## How it surfaced

Not through monitoring. The founder pulled up the platform's own billing screen
and the numbers did not match the report. The real cost was roughly double what
we had been reporting.

## What I changed

Three rules, applied to every cost figure before it reaches a report:

1. **Check coverage before you check value.** `COUNT(DISTINCT date)` per store,
   compared against the days in the period. If it is not complete, stop.
2. **Reconcile against the billing screen, not the analytics screen.** Analytics
   is modelled. Billing is what leaves your bank account.
3. **Cross-check revenue against an independent source.** If platform-reported
   revenue and analytics-reported revenue agree, the revenue side is probably
   fine and you can focus suspicion on cost.

## The part worth generalising

A sync gap is not a rare event you can design around once. It is an ongoing
condition of every third-party data pipeline you do not own. The question is not
whether your warehouse will silently drop days — it is whether your report
notices when it does.

Ours did not. Now it does.
