import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WordBank } from "@/components/WordBank";

const blanks = [
  { answer: "fork()", distractors: ["exec()", "clone()"] },
  { answer: "0", distractors: ["1", "-1"] },
];

describe("WordBank", () => {
  it("renders all chips (answers + distractors)", () => {
    render(
      <WordBank
        blanks={blanks}
        filledValues={[null, null]}
        activeBlankIndex={0}
        submitted={false}
        onChipSelect={() => {}}
      />
    );

    const wordBank = screen.getByTestId("word-bank");
    // 2 answers + 4 distractors = 6 chips total
    expect(wordBank.children).toHaveLength(6);
  });

  it("calls onChipSelect when a chip is clicked", async () => {
    const user = userEvent.setup();
    let selected = "";
    render(
      <WordBank
        blanks={blanks}
        filledValues={[null, null]}
        activeBlankIndex={0}
        submitted={false}
        onChipSelect={(v) => {
          selected = v;
        }}
      />
    );

    // Click the first available button
    const buttons = screen.getAllByRole("button");
    await user.click(buttons[0]);
    expect(selected).toBeTruthy();
  });

  it("shows ghost state for used chips", () => {
    render(
      <WordBank
        blanks={blanks}
        filledValues={["fork()", null]}
        activeBlankIndex={1}
        submitted={false}
        onChipSelect={() => {}}
      />
    );

    const wordBank = screen.getByTestId("word-bank");
    // One chip should be ghost (has text-transparent class)
    const ghostChips = Array.from(wordBank.children).filter((el) =>
      el.className.includes("text-transparent")
    );
    expect(ghostChips).toHaveLength(1);
  });

  it("disables chips when submitted", () => {
    render(
      <WordBank
        blanks={blanks}
        filledValues={["fork()", "0"]}
        activeBlankIndex={null}
        submitted={true}
        onChipSelect={() => {}}
      />
    );

    const wordBank = screen.getByTestId("word-bank");
    // Non-ghost chips should have cursor-not-allowed
    const disabledChips = Array.from(wordBank.children).filter((el) =>
      el.className.includes("cursor-not-allowed")
    );
    expect(disabledChips.length).toBeGreaterThan(0);
  });

  it("disables chip buttons when no active blank", () => {
    render(
      <WordBank
        blanks={blanks}
        filledValues={["fork()", "0"]}
        activeBlankIndex={null}
        submitted={false}
        onChipSelect={() => {}}
      />
    );

    // All remaining buttons should be disabled
    const buttons = screen.queryAllByRole("button");
    for (const btn of buttons) {
      expect(btn).toBeDisabled();
    }
  });
});
