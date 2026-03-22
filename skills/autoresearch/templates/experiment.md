# Experiment: {title}

**Date**: YYYY-MM-DD
**Scope**: {改善対象のファイルパスまたは領域}
**Metric**: {計測する指標}
**Direction**: {higher / lower}
**Iteration**: N / max_N

---

## Baseline

| Metric | Value |
|--------|-------|
| {metric_name} | {baseline_value} |

## Hypothesis

{この変更で metric が direction に動くと予想する理由}

## Change

```diff
{変更の diff を貼る}
```

## Result

| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| {metric_name} | {before} | {after} | {+/-delta} |

## Verdict

**KEEP** / **DISCARD** / **ITERATE**

- KEEP: metric が direction に改善した → 変更を保持して次のイテレーションへ
- DISCARD: metric が悪化した → 変更をロールバック
- ITERATE: 改善不十分 → 仮説を修正して再試行

## Notes

{学んだこと、次のイテレーションへの示唆}
